import { useState, useEffect } from 'react'
import { fetchDolares, getDolarByCasa } from '../services/cotizacion'
import type { DolarItem } from '../types/cotizacion'
import type { TipoDolar } from '../types/cotizacion'

export function useCotizacion() {
  const [dolares, setDolares] = useState<DolarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchDolares()
      .then((data) => {
        if (!cancelled) {
          setDolares(data)
          const last = data[0]
          setUpdatedAt(last ? new Date(last.fechaActualizacion) : null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  function getByTipo(tipo: TipoDolar): DolarItem | undefined {
    return getDolarByCasa(dolares, tipo)
  }

  function minutosDesdeActualizacion(): number | null {
    if (!updatedAt) return null
    return Math.floor((Date.now() - updatedAt.getTime()) / 60000)
  }

  /** Texto para leyenda: "5 min", "1 hora y 5 min", "1 día y 2 horas" */
  function actualizadoHaceTexto(): string | null {
    const min = minutosDesdeActualizacion()
    if (min === null) return null
    if (min < 60) return `${min} min`
    if (min < 1440) {
      const h = Math.floor(min / 60)
      const m = min % 60
      const horaStr = h === 1 ? '1 hora' : `${h} horas`
      if (m === 0) return horaStr
      return `${horaStr} y ${m} min`
    }
    const d = Math.floor(min / 1440)
    const restMin = min % 1440
    const h = Math.floor(restMin / 60)
    const diaStr = d === 1 ? '1 día' : `${d} días`
    if (h === 0) return diaStr
    const horaStr = h === 1 ? '1 hora' : `${h} horas`
    return `${diaStr} y ${horaStr}`
  }

  return {
    dolares,
    loading,
    error,
    updatedAt,
    getByTipo,
    minutosDesdeActualizacion,
    actualizadoHaceTexto,
  }
}
