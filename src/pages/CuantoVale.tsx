import { useMemo, useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonNote,
} from '@ionic/react'
import { useCotizacion } from '../hooks/useCotizacion'
import { getVenta } from '../services/cotizacion'

const TIPOS_MOSTRAR = [
  { casa: 'blue' as const, label: 'Blue' },
  { casa: 'bolsa' as const, label: 'MEP (Bolsa)' },
  { casa: 'contadoconliqui' as const, label: 'CCL' },
  { casa: 'tarjeta' as const, label: 'Con tarjeta' },
]

const CuantoVale = () => {
  usePageTitle('Cuánto vale en pesos', 'Precio en dólares a pesos: blue, MEP, con tarjeta.')
  const { loading, error, getByTipo, minutosDesdeActualizacion } = useCotizacion()
  const [usd, setUsd] = useState<string>('')

  const numUsd = useMemo(() => {
    const n = usd === '' || usd === '-' ? NaN : Number(usd.replace(/,/g, '.'))
    return Number.isNaN(n) || n < 0 ? null : n
  }, [usd])

  const formatNum = (n: number) =>
    n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cuánto vale en pesos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="content-wrap">
        <h1>Cuánto vale en pesos</h1>
        <p>Ingresá un precio en dólares y ves el equivalente en pesos (blue, MEP, tarjeta).</p>

        <IonItem>
          <IonLabel>Precio en USD</IonLabel>
          <IonInput
            type="text"
            inputMode="decimal"
            value={usd}
            onIonInput={(e) => setUsd(e.detail.value ?? '')}
            placeholder="0"
          />
        </IonItem>

        {loading && <IonSpinner name="crescent" />}
        {error && <IonNote color="danger">{error}</IonNote>}

        {!loading && numUsd !== null && numUsd > 0 && (
          <IonCard>
            <IonCardContent>
              <strong>{formatNum(numUsd)} USD equivale a:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {TIPOS_MOSTRAR.map(({ casa, label }) => {
                  const d = getByTipo(casa)
                  const venta = getVenta(d)
                  const ars = venta * numUsd
                  return (
                    <li key={casa}>
                      {label}: <strong>{formatNum(ars)} ARS</strong>
                    </li>
                  )
                })}
              </ul>
            </IonCardContent>
          </IonCard>
        )}

        {minutosDesdeActualizacion() !== null && (
          <IonNote className="ion-margin-top">
            Cotización actualizada hace {minutosDesdeActualizacion()} min
          </IonNote>
        )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CuantoVale
