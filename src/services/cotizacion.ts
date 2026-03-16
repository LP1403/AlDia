import type { DolarItem } from '../types/cotizacion'

const BASE_URL = 'https://dolarapi.com/v1'
const CACHE_MS = 5 * 60 * 1000 // 5 minutes

let cache: { data: DolarItem[]; at: number } | null = null

export async function fetchDolares(): Promise<DolarItem[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return cache.data
  }
  const res = await fetch(`${BASE_URL}/dolares`)
  if (!res.ok) throw new Error('Error al obtener cotizaciones')
  const data: DolarItem[] = await res.json()
  cache = { data, at: Date.now() }
  return data
}

export function getDolarByCasa(dolares: DolarItem[], casa: string): DolarItem | undefined {
  return dolares.find((d) => d.casa === casa)
}

export function getVenta(d: DolarItem | undefined): number {
  return d?.venta ?? 0
}

export function getCompra(d: DolarItem | undefined): number {
  return d?.compra ?? 0
}
