import { IonTabBar, IonTabButton, IonLabel } from '@ionic/react'
import { useLocation } from 'react-router-dom'

const TABS = [
  { path: '/', label: 'Inicio' },
  { path: '/dolar', label: 'Dólar' },
  { path: '/cuanto-vale', label: 'En pesos' },
  { path: '/cuenta', label: 'Cuenta' },
  { path: '/alquiler', label: 'Alquiler' },
  { path: '/aumento-alquiler', label: 'Aumento' },
] as const

export default function NavTabs() {
  const location = useLocation()
  return (
    <IonTabBar slot="top" className="nav-tabs">
      {TABS.map(({ path, label }) => (
        <IonTabButton key={path} tab={path} href={path} selected={location.pathname === path}>
          <IonLabel>{label}</IonLabel>
        </IonTabButton>
      ))}
    </IonTabBar>
  )
}
