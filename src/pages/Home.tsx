import { IonContent, IonPage } from '@ionic/react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

const TOOLS = [
  { to: '/dolar', title: 'Dólar', desc: 'Cotización blue, MEP, CCL, oficial. Convertir ARS ↔ USD.' },
  { to: '/cuanto-vale', title: 'Cuánto vale en pesos', desc: 'Precio en USD a pesos (blue, MEP, tarjeta).' },
  { to: '/cuenta', title: 'Dividir cuenta / Propina', desc: 'Partes iguales o calcular propina. Compartir link.' },
  { to: '/alquiler', title: 'Calculadora de alquiler', desc: 'Máximo a pagar según tus ingresos.' },
  { to: '/aumento-alquiler', title: 'Próximo aumento alquiler', desc: 'Estimación según ICL (Ley 27.551).' },
]

const Home = () => {
  usePageTitle('Inicio', 'Herramientas de uso cotidiano: dólar, cuenta, propina, alquiler.')
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="content-wrap">
          <h1>Al Día</h1>
          <p>Herramientas de uso cotidiano: dólar, cuenta, propina, alquiler.</p>
          <div style={{ marginTop: 24 }}>
            {TOOLS.map(({ to, title, desc }) => (
              <Link key={to} to={to} className="link-card">
                <strong>{title}</strong>
                <p>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home
