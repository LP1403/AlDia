import { useState, useEffect, useMemo } from 'react'
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
  IonSpinner,
  IonNote,
} from '@ionic/react'
import { fetchIcl, getIclEnFecha, getUltimaFechaIcl, type IclDetalle } from '../services/indicesBcra'

const formatNum = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

function formatFechaCorta(iso: string): string {
  const [y, m] = iso.slice(0, 7).split('-')
  const mes = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('es-AR', { month: 'long' })
  return `${mes} ${y}`
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

const AumentoAlquiler = () => {
  usePageTitle('Aumento alquiler ICL', 'Calculadora próximo aumento de alquiler según ICL.')
  const [montoActual, setMontoActual] = useState<string>('')
  const [fechaContrato, setFechaContrato] = useState<string>(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 12)
    return d.toISOString().slice(0, 10)
  })
  const [iclData, setIclData] = useState<IclDetalle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchIcl()
      .then((data) => {
        if (!cancelled) setIclData(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar ICL')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const numMonto = useMemo(() => {
    const n = parseFloat(montoActual.replace(/,/g, '.'))
    return Number.isNaN(n) || n < 0 ? null : n
  }, [montoActual])

  const proximoAumento = useMemo(() => {
    if (numMonto == null || numMonto <= 0 || !fechaContrato || iclData.length === 0) return null
    const fechaProximo = addMonths(fechaContrato, 12)
    const iclInicio = getIclEnFecha(iclData, fechaContrato)
    const iclProximo = getIclEnFecha(iclData, fechaProximo)
    if (iclInicio == null || iclInicio === 0) return null
    if (iclProximo == null) return null
    const factor = iclProximo / iclInicio
    return {
      monto: numMonto * factor,
      factor,
      iclInicio,
      iclProximo,
      fechaProximo,
    }
  }, [numMonto, fechaContrato, iclData])

  const fechaProximoSinIcl = useMemo(() => {
    if (!fechaContrato || iclData.length === 0) return null
    const fechaProximo = addMonths(fechaContrato, 12)
    const ultimaFecha = getUltimaFechaIcl(iclData)
    if (!ultimaFecha) return null
    if (fechaProximo.slice(0, 7) > ultimaFecha.slice(0, 7)) return { fechaProximo, ultimaFecha }
    return null
  }, [fechaContrato, iclData])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/" fill="clear" className="toolbar-home-btn">
              ← Inicio
            </IonButton>
          </IonButtons>
          <IonTitle>Calculadora próximo aumento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="content-wrap">
        <p className="content-intro">Monto actual, fecha de contrato (o último ajuste). Índice ICL (Ley 27.551).</p>

        <div className="form-field">
          <label>Alquiler actual (ARS/mes)</label>
          <IonInput
            type="text"
            inputMode="decimal"
            value={montoActual}
            onIonInput={(e) => setMontoActual(e.detail.value ?? '')}
            placeholder="0"
          />
        </div>

        <div className="form-field">
          <label>Fecha inicio contrato o último ajuste</label>
          <IonInput
            type="date"
            value={fechaContrato}
            onIonInput={(e) => setFechaContrato((e.detail.value as string) ?? '')}
          />
        </div>

        {loading && <IonSpinner name="crescent" />}
        {error && <IonNote color="danger">{error}</IonNote>}

        {!loading && proximoAumento && (
          <IonCard>
            <IonCardContent>
              <p>
                <strong>
                  Tu próximo aumento sería aproximadamente: {formatNum(proximoAumento.monto)} ARS/mes
                </strong>
              </p>
              <p>
                (ICL inicio: {proximoAumento.iclInicio.toFixed(2)} → ICL próximo: {proximoAumento.iclProximo.toFixed(2)})
              </p>
              <IonNote>Referencia a 12 meses desde la fecha indicada. Consultá con tu contrato.</IonNote>
            </IonCardContent>
          </IonCard>
        )}

        {!loading && !proximoAumento && fechaProximoSinIcl && numMonto != null && numMonto > 0 && (
          <IonCard>
            <IonCardContent>
              <p>
                <strong>El ICL del mes de tu próximo ajuste aún no está publicado.</strong>
              </p>
              <p>
                Tu próximo ajuste sería en <strong>{formatFechaCorta(fechaProximoSinIcl.fechaProximo)}</strong>. 
                El BCRA publica el ICL con cierto retraso; el último disponible es de <strong>{formatFechaCorta(fechaProximoSinIcl.ultimaFecha)}</strong>.
              </p>
              <p>Cuando se publique el ICL de ese mes, podrás calcular acá el nuevo monto. Mientras tanto, tu alquiler actual es {formatNum(numMonto)} ARS/mes.</p>
            </IonCardContent>
          </IonCard>
        )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AumentoAlquiler
