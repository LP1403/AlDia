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

  return {
    dolares,
    loading,
    error,
    updatedAt,
    getByTipo,
    minutosDesdeActualizacion,
  }
}
