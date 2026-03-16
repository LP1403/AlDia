# Tecnología y hosting para los proyectos

## Stack elegido

- **Frontend / App:** React + Ionic + Capacitor
  - **React:** lógica y componentes.
  - **Ionic:** componentes de UI (web y móvil).
  - **Capacitor:** empaquetar la misma app como web y como app nativa (iOS/Android).

- **Uso flexible:**
  - Solo web: se deploya la build web (sin usar Capacitor).
  - Solo app: mismo código + build con Capacitor.
  - Web + app: mismo proyecto, deploy web + builds nativos cuando se quiera.

## Hosting y backend

- **Hosting:** Firebase Hosting (tier gratis al arranque; escala con CDN).
- **Opcional:** Firebase Auth y Firestore si el proyecto requiere usuarios o base de datos.
- **Alternativas** para solo web: Vercel o Netlify (también gratis y escalables para React).

## Escalabilidad

- React + Ionic + Capacitor escalan bien (más usuarios, más features, más plataformas).
- El límite suele estar en backend/APIs/DB, no en este frontend.
- Firebase Hosting y Firestore/Auth escalan con el uso; el costo crece con el tráfico/uso (adecuado cuando ya hay monetización).

## Monetización (aspecto técnico)

- No hay impedimento: se puede integrar paywall, suscripciones (Stripe, Mercado Pago, etc.) y compras in-app en las stores vía plugins de Capacitor.
- Firebase permite arrancar en gratis y pagar por uso cuando el proyecto genere ingresos.
