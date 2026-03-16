import { useEffect } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  IonListHeader,
} from '@ionic/react'
import { useLocation } from 'react-router-dom'
import { useCuenta, useCuentaParams, type ModoCuenta } from '../hooks/useCuenta'

const formatNum = (n: number) =>
  n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const CuentaPropina = () => {
  usePageTitle('Dividir cuenta', 'Dividir cuenta en pesos y calcular propina. Compartir link.')
  const location = useLocation()
  const params = useCuentaParams(location.search)
  const {
    modo,
    setModo,
    total,
    setTotal,
    propinaPct,
    setPropinaPct,
    partesIguales,
    setPartesIguales,
    propinaMonto,
    totalConPropina,
    porPersona,
    shareUrl,
    PROPINAS_PORCENTAJE,
  } = useCuenta(
    params.total ?? 0,
    params.modo,
    params.personas ?? 1
  )

  useEffect(() => {
    if (params.total != null && params.total > 0) setTotal(params.total)
    if (params.propinaPct != null) setPropinaPct(params.propinaPct)
    if (params.personas != null && params.personas > 0) setPartesIguales(params.personas)
  }, [params.total, params.propinaPct, params.personas])

  const handleShare = () => {
    const url = shareUrl()
    navigator.clipboard.writeText(url).then(() => {
      // Could show toast "Link copiado"
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/" fill="clear" className="toolbar-home-btn">
              ← Inicio
            </IonButton>
          </IonButtons>
          <IonTitle>Dividir cuenta / Propina</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="content-wrap">
        <IonSegment value={modo} onIonChange={(e) => setModo(e.detail.value as ModoCuenta)}>
          <IonSegmentButton value="cuenta">
            <IonLabel>Dividir cuenta</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="propina">
            <IonLabel>Propina</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <div className="form-field">
          <label>Total (ARS)</label>
          <IonInput
            type="number"
            inputMode="decimal"
            value={total}
            onIonInput={(e) => setTotal(parseFloat((e.detail.value as string) ?? '0') || 0)}
            placeholder="0"
          />
        </div>

        {modo === 'cuenta' && (
          <>
            <div className="form-field">
              <label>Partes iguales (personas)</label>
              <IonInput
                type="number"
                inputMode="numeric"
                min={1}
                value={partesIguales}
                onIonInput={(e) =>
                  setPartesIguales(Math.max(1, parseInt((e.detail.value as string) ?? '1', 10) || 1))
                }
              />
            </div>
            {total > 0 && partesIguales > 0 && (
              <IonCard>
                <IonCardContent>
                  <strong>Cada uno paga: {formatNum(porPersona)} ARS</strong>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}

        {modo === 'propina' && (
          <>
            <IonListHeader>Propina %</IonListHeader>
            <IonSegment
              value={String(propinaPct)}
              onIonChange={(e) => setPropinaPct(parseFloat(e.detail.value as string) || 0)}
            >
              {PROPINAS_PORCENTAJE.map((p) => (
                <IonSegmentButton key={p} value={String(p)}>
                  <IonLabel>{p}%</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
            {total > 0 && (
              <IonCard>
                <IonCardContent>
                  <p>Propina: {formatNum(propinaMonto)} ARS</p>
                  <p>
                    <strong>Total con propina: {formatNum(totalConPropina)} ARS</strong>
                  </p>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}

        <IonButton expand="block" onClick={handleShare} className="ion-margin-top">
          Copiar link para compartir
        </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CuentaPropina
