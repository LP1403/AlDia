const BCRA_ICL_URL = 'https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/7988'
const CACHE_KEY = 'aldia_icl_7988'
const CACHE_MS = 24 * 60 * 60 * 1000 // 24 hours

export interface IclDetalle {
  fecha: string
  valor: number
}

export interface BcraIclResponse {
  status: number
  results?: Array<{
    idVariable: number
    detalle: IclDetalle[]
  }>
}

let memoryCache: { data: IclDetalle[]; at: number } | null = null

function getFromStorage(): IclDetalle[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, at } = JSON.parse(raw)
    if (at && Date.now() - at < CACHE_MS) return data
  } catch {
    // ignore
  }
  return null
}

function setStorage(data: IclDetalle[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, at: Date.now() }))
  } catch {
    // ignore
  }
}

export async function fetchIcl(desde?: string, hasta?: string, limit = 365): Promise<IclDetalle[]> {
  if (memoryCache && Date.now() - memoryCache.at < CACHE_MS) {
    return memoryCache.data
  }
  const stored = getFromStorage()
  if (stored?.length) {
    memoryCache = { data: stored, at: Date.now() }
    return stored
  }

  const params = new URLSearchParams()
  if (desde) params.set('Desde', desde)
  if (hasta) params.set('Hasta', hasta)
  params.set('Limit', String(limit))
  const url = `${BCRA_ICL_URL}?${params.toString()}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`BCRA ${res.status}`)
    const json: BcraIclResponse = await res.json()
    const detalle = json.results?.[0]?.detalle ?? []
    if (detalle.length > 0) {
      memoryCache = { data: detalle, at: Date.now() }
      setStorage(detalle)
      return detalle
    }
  } catch {
    // fall through to fallback
  }

  const mod = await import('../data/indicesIclFallback.json')
  const fallback = (mod as { default?: IclDetalle[] }).default ?? (mod as unknown as IclDetalle[])
  return Array.isArray(fallback) ? fallback : []
}

/** Última fecha disponible en la serie (YYYY-MM-DD). No usar ICL para fechas posteriores. */
export function getUltimaFechaIcl(detalle: IclDetalle[]): string | null {
  if (detalle.length === 0) return null
  const max = detalle.reduce((m, d) => (d.fecha > m ? d.fecha : m), detalle[0].fecha)
  return max
}

/**
 * ICL para una fecha. Si la fecha es futura (posterior al último dato del BCRA), retorna null:
 * no se puede “adivinar” el ICL futuro, y usar el último daría factor 1 (aumento = 0) incorrecto.
 */
export function getIclEnFecha(detalle: IclDetalle[], fecha: string): number | null {
  if (detalle.length === 0) return null
  const ultimaFecha = getUltimaFechaIcl(detalle)!
  if (fecha.slice(0, 7) > ultimaFecha.slice(0, 7)) return null
  const target = fecha.slice(0, 7)
  const exact = detalle.find((d) => d.fecha.slice(0, 10) === fecha.slice(0, 10))
  if (exact) return exact.valor
  const sameMonth = detalle.filter((d) => d.fecha.slice(0, 7) === target)
  if (sameMonth.length > 0) {
    sameMonth.sort((a, b) => b.fecha.localeCompare(a.fecha))
    return sameMonth[0].valor
  }
  const before = detalle.filter((d) => d.fecha <= fecha).sort((a, b) => b.fecha.localeCompare(a.fecha))
  if (before.length > 0) return before[0].valor
  const after = detalle.filter((d) => d.fecha >= fecha).sort((a, b) => a.fecha.localeCompare(b.fecha))
  return after[0]?.valor ?? null
}
