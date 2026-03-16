export interface DolarItem {
  moneda: string
  casa: string
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
  variacion?: number
}

export type TipoDolar = 'blue' | 'bolsa' | 'contadoconliqui' | 'oficial' | 'tarjeta'

export const TIPOS_DOLAR: { value: TipoDolar; label: string }[] = [
  { value: 'blue', label: 'Blue' },
  { value: 'bolsa', label: 'MEP (Bolsa)' },
  { value: 'contadoconliqui', label: 'CCL' },
  { value: 'oficial', label: 'Oficial' },
  { value: 'tarjeta', label: 'Tarjeta' },
]
