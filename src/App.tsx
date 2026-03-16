import { IonApp, IonRouterOutlet, IonTabs } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route } from 'react-router-dom'
import Home from './pages/Home'
import Dolar from './pages/Dolar'
import CuantoVale from './pages/CuantoVale'
import CuentaPropina from './pages/CuentaPropina'
import Alquiler from './pages/Alquiler'
import AumentoAlquiler from './pages/AumentoAlquiler'
import NavTabs from './components/NavTabs'

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/" component={Home} />
            <Route exact path="/dolar" component={Dolar} />
            <Route exact path="/cuanto-vale" component={CuantoVale} />
            <Route exact path="/cuenta" component={CuentaPropina} />
            <Route exact path="/alquiler" component={Alquiler} />
            <Route exact path="/aumento-alquiler" component={AumentoAlquiler} />
          </IonRouterOutlet>
          <NavTabs />
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
