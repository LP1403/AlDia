import { useState, useMemo } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonInput,
  IonCard,
  IonCardContent,
} from '@ionic/react'

const PORCENTAJE_OPCIONES = [25, 30, 35, 40]

const formatNum = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const Alquiler = () => {
  usePageTitle('Calculadora de alquiler', 'Máximo que podés pagar de alquiler según tus ingresos.')
  const [ingresos, setIngresos] = useState<string>('')
  const [porcentaje, setPorcentaje] = useState(30)

  const numIngresos = useMemo(() => {
    const n = parseFloat(ingresos.replace(/,/g, '.'))
    return Number.isNaN(n) || n < 0 ? null : n
  }, [ingresos])

  const maxAlquiler = useMemo(() => {
    if (numIngresos == null || numIngresos <= 0) return null
    return (numIngresos * porcentaje) / 100
  }, [numIngresos, porcentaje])

  const queda = useMemo(() => {
    if (numIngresos == null || maxAlquiler == null) return null
    return numIngresos - maxAlquiler
  }, [numIngresos, maxAlquiler])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/" fill="clear" className="toolbar-home-btn">
              ← Inicio
            </IonButton>
          </IonButtons>
          <IonTitle>Calculadora de alquiler</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="content-wrap">
        <p className="content-intro">Ingresos mensuales y % que podés destinar al alquiler. Te mostramos el máximo a pagar y cuánto te queda.</p>

        <div className="form-field">
          <label>Ingresos mensuales (ARS)</label>
          <IonInput
            type="text"
            inputMode="decimal"
            value={ingresos}
            onIonInput={(e) => setIngresos(e.detail.value ?? '')}
            placeholder="0"
          />
        </div>

        <div className="form-field">
          <label>% para alquiler</label>
          <IonInput
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            value={porcentaje}
            onIonInput={(e) =>
              setPorcentaje(Math.min(100, Math.max(0, parseInt((e.detail.value as string) ?? '30', 10) || 30)))
            }
          />
        </div>
        <div className="form-options">
          {PORCENTAJE_OPCIONES.map((p) => (
            <button
              key={p}
              type="button"
              className={porcentaje === p ? 'form-options__btn form-options__btn--active' : 'form-options__btn'}
              onClick={() => setPorcentaje(p)}
            >
              {p}%
            </button>
          ))}
        </div>

        {maxAlquiler != null && maxAlquiler > 0 && (
          <IonCard>
            <IonCardContent>
              <p><strong>Máximo a pagar de alquiler: {formatNum(maxAlquiler)} ARS/mes</strong></p>
              {queda != null && <p>Te queda por mes: {formatNum(queda)} ARS</p>}
            </IonCardContent>
          </IonCard>
        )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Alquiler
