import { useState, useMemo } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonNote,
} from '@ionic/react'
import { useCotizacion } from '../hooks/useCotizacion'
import { TIPOS_DOLAR, type TipoDolar } from '../types/cotizacion'
import { getVenta } from '../services/cotizacion'

const Dolar = () => {
  usePageTitle('Dólar blue hoy', 'Convertir dólares a pesos. Cotización blue, MEP, CCL, oficial.')
  const { dolares, loading, error, getByTipo, minutosDesdeActualizacion } = useCotizacion()
  const [tipo, setTipo] = useState<TipoDolar>('blue')
  const [monto, setMonto] = useState<string>('')
  const [esArs, setEsArs] = useState<boolean>(true) // true = input en ARS, false = input en USD

  const cotizacion = useMemo(() => getByTipo(tipo), [dolares, tipo, getByTipo])
  const tasa = getVenta(cotizacion)

  const num = useMemo(() => (monto === '' || monto === '-' ? NaN : Number(monto.replace(/,/g, '.'))), [monto])
  const convertido = useMemo(() => {
    if (Number.isNaN(num) || num < 0) return null
    if (esArs) return num / tasa // ARS -> USD
    return num * tasa // USD -> ARS
  }, [num, tasa, esArs])

  const formatNum = (n: number) =>
    n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dólar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="content-wrap">
        <h1>Cotizador dólar</h1>

        <IonItem>
          <IonLabel>Tipo</IonLabel>
          <IonSelect
            value={tipo}
            onIonChange={(e) => setTipo(e.detail.value as TipoDolar)}
            interface="action-sheet"
          >
            {TIPOS_DOLAR.map((t) => (
              <IonSelectOption key={t.value} value={t.value}>
                {t.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {loading && <IonSpinner name="crescent" />}
        {error && <IonNote color="danger">{error}</IonNote>}

        {cotizacion && !loading && (
          <>
            <IonItem>
              <IonLabel>1 USD = {formatNum(cotizacion.venta)} ARS (venta)</IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>{esArs ? 'Pesos (ARS)' : 'Dólares (USD)'}</IonLabel>
              <IonInput
                type="text"
                inputMode="decimal"
                value={monto}
                onIonInput={(e) => setMonto(e.detail.value ?? '')}
                placeholder={esArs ? '0' : '0'}
              />
            </IonItem>
            <IonItem button onClick={() => setEsArs((v) => !v)}>
              <IonLabel>Cambiar a {esArs ? 'USD' : 'ARS'}</IonLabel>
            </IonItem>

            {convertido !== null && (
              <IonCard>
                <IonCardContent>
                  <strong>
                    {esArs
                      ? `${formatNum(num)} ARS = ${formatNum(convertido)} USD`
                      : `${formatNum(num)} USD = ${formatNum(convertido)} ARS`}
                  </strong>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}

        {minutosDesdeActualizacion() !== null && (
          <IonNote className="ion-margin-top">
            Actualizado hace {minutosDesdeActualizacion()} min
          </IonNote>
        )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Dolar
