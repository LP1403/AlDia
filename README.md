# Al Día

Herramientas de uso cotidiano para Argentina: dólar (blue, MEP, CCL, oficial), cuánto vale en pesos, dividir cuenta, propina, calculadora de alquiler y próximo aumento (ICL).

## v0 – Web

- **Stack:** React + Vite + TypeScript, Ionic React, Capacitor (preparado para app).
- **Hosting:** Firebase Hosting (proyecto `aldia-ee57e`).
- **Datos:** DolarAPI (cotizaciones), API BCRA (ICL serie 7988) con cache en cliente; sin backend ni base de datos.

### Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

La salida queda en `dist/`.

### Deploy a Firebase Hosting

1. Instalá dependencias: `npm install` (incluye `firebase-tools` como devDependency).
2. Iniciá sesión en Firebase (solo la primera vez): `npx firebase login`
3. Desplegá: `npm run deploy`

El script hace `build` y luego `firebase deploy`. El sitio quedará en la URL del proyecto (ej. `https://aldia-ee57e.web.app`).

### Rutas

| Ruta | Herramienta |
|------|-------------|
| `/` | Inicio |
| `/dolar` | Cotizador dólar |
| `/cuanto-vale` | Cuánto vale en pesos |
| `/cuenta` | Dividir cuenta / Propina |
| `/alquiler` | Calculadora de alquiler |
| `/aumento-alquiler` | Próximo aumento (ICL) |

## App nativa (futuro)

El proyecto está preparado para empaquetar como app con Capacitor:

1. Agregar plataformas: `npx cap add ios` y/o `npx cap add android`
2. Build web: `npm run build`
3. Sincronizar: `npx cap sync`
4. Abrir en IDE nativo: `npx cap open ios` o `npx cap open android`

Configuración en `capacitor.config.ts` (appId: `ar.aldia.app`, appName: Al Día, webDir: `dist`).
