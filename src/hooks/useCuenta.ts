import { useState, useCallback } from 'react'

export type ModoCuenta = 'cuenta' | 'propina'

export interface ItemCuenta {
  id: string
  nombre: string
  monto: number
}

const PROPINAS_PORCENTAJE = [10, 15, 20, 25]

function parseFloatSafe(s: string): number {
  const n = parseFloat(s.replace(/,/g, '.'))
  return Number.isNaN(n) ? 0 : Math.max(0, n)
}

export function useCuentaParams(search: string) {
  const params = new URLSearchParams(search)
  const totalStr = params.get('total')
  const propinaStr = params.get('propina')
  const modo = (params.get('modo') === 'propina' ? 'propina' : 'cuenta') as ModoCuenta
  const itemsStr = params.get('items') // "nombre1:monto1,nombre2:monto2" or for equal parts just total
  return {
    total: totalStr != null ? parseFloatSafe(totalStr) : null,
    propinaPct: propinaStr != null ? parseFloatSafe(propinaStr) : null,
    modo,
    itemsStr: itemsStr ?? null,
  }
}

export function useCuenta(initialTotal = 0, initialModo: ModoCuenta = 'cuenta') {
  const [modo, setModo] = useState<ModoCuenta>(initialModo)
  const [total, setTotal] = useState(initialTotal)
  const [items, setItems] = useState<ItemCuenta[]>([])
  const [propinaPct, setPropinaPct] = useState(15)
  const [partesIguales, setPartesIguales] = useState(1)

  const totalItems = items.reduce((s, i) => s + i.monto, 0)
  const propinaMonto = modo === 'propina' ? (total * propinaPct) / 100 : 0
  const totalConPropina = total + propinaMonto
  const porPersona =
    modo === 'cuenta'
      ? partesIguales > 0
        ? total / partesIguales
        : 0
      : totalConPropina

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), nombre: '', monto: 0 },
    ])
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<ItemCuenta>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch } : i))
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const shareUrl = useCallback(() => {
    const params = new URLSearchParams()
    params.set('total', String(total))
    params.set('modo', modo)
    if (modo === 'propina') params.set('propina', String(propinaPct))
    if (modo === 'cuenta' && items.length > 0) {
      params.set(
        'items',
        items.map((i) => `${encodeURIComponent(i.nombre || 'Item')}:${i.monto}`).join(',')
      )
    }
    if (modo === 'cuenta' && partesIguales > 0) params.set('personas', String(partesIguales))
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }, [total, modo, propinaPct, items, partesIguales])

  return {
    modo,
    setModo,
    total,
    setTotal,
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
    propinaPct,
    setPropinaPct,
    partesIguales,
    setPartesIguales,
    totalItems,
    propinaMonto,
    totalConPropina,
    porPersona,
    shareUrl,
    PROPINAS_PORCENTAJE,
  }
}
