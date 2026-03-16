# Contexto completo: proyecto Al Día

Documento para pasar a otra ventana de Cursor u otro agente. Contiene todo el contexto del proyecto **Al Día** (app dinero día a día): idea, plan, lo implementado, decisiones técnicas y cómo seguir.

---

## 1. Qué es Al Día

- **Producto:** Al Día — herramientas de uso cotidiano para Argentina: dólar (blue, MEP, CCL, oficial), “cuánto vale en pesos”, dividir cuenta, propina, calculadora de alquiler y próximo aumento (ICL).
- **Público:** Cualquier persona en Argentina que compra en dólares, divide cuenta, paga propina, alquila o evalúa cuánto puede pagar.
- **Origen:** Ideas agrupadas en `agrupaciones/02-app-dinero-dia-a-dia.md` (dentro del repo Brainstorming).
- **Nombre del app/producto:** “Al Día”. Proyecto en carpeta **AlDia** (o `AlDia/` en la raíz del repo).

---

## 2. Stack y ubicación

- **Frontend:** React + Vite + TypeScript.
- **UI:** Ionic React (componentes que sirven para web y para app después).
- **App futura:** Capacitor ya está en el proyecto (config listo); por ahora solo web.
- **Hosting:** Firebase Hosting. Proyecto Firebase ya creado por el usuario.
- **Backend:** No hay. v0 es 100% frontend: llamadas a APIs públicas desde el navegador, cache en cliente.

**Ubicación del código:** carpeta `AlDia/` en la raíz del repo (p. ej. `c:\Repos\Brainstorming\AlDia` si el repo es Brainstorming).

---

## 3. Firebase

- **Nombre del proyecto:** AlDia  
- **ID del proyecto:** `aldia-ee57e`  
- **Número:** 372925065134  
- **Hosting:** Configurado; directorio de deploy = `dist` (salida de `vite build`).  
- **Dominio:** Temporal por ahora (ej. `aldia-ee57e.web.app`).  
- **Auth/Firestore:** No usados en v0.  
- **SDK en el código:** Opcional; si se quiere Analytics se puede agregar después el `firebaseConfig` que generó la consola.

Archivos en el proyecto: `.firebaserc` (proyecto `aldia-ee57e`), `firebase.json` (hosting, public: `dist`), script `npm run deploy` (build + `npx firebase deploy`). Deploy requiere `npx firebase login` la primera vez.

---

## 4. APIs y datos (sin base de datos)

- **Cotizaciones dólar:** [DolarAPI.com](https://dolarapi.com/docs/argentina/)  
  - Base URL: `https://dolarapi.com`  
  - Uso: `GET https://dolarapi.com/v1/dolares` (devuelve blue, bolsa/MEP, contadoconliqui/CCL, oficial, tarjeta, etc.).  
  - Sin API key. Llamadas desde el frontend. Cache en cliente ~5 min para no abusar.

- **Índices ICL (alquiler):** API pública del BCRA.  
  - ICL = serie **7988**.  
  - Endpoint intentado: `GET https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias/7988` (puede devolver 400 según formato; en la app hay fallback).  
  - Documentación: [Principales Variables BCRA](https://principales-variables.bcra.apidocs.ar/).  
  - Sin API key. **Sin base de datos:** se obtienen desde el frontend al usar la calculadora de aumento, con **cache en cliente** (24 h en memoria + localStorage).  
  - Si la API falla o no está disponible: **fallback** con JSON estático en el repo (`src/data/indicesIclFallback.json`).

- **Decisión:** No usar Firestore ni backend para v0. Todo desde el navegador con cache.

---

## 5. Plan v0 (lo acordado)

- Cotizador dólar (DolarAPI).  
- “Cuánto vale en pesos” (mismo motor de conversión).  
- Dividir cuenta + propina en una pantalla con dos modos; link compartible por URL (query params).  
- Calculadora de alquiler (máximo a pagar, % de ingresos).  
- Calculadora de próximo aumento (ICL; API BCRA + fallback JSON).  
- Navegación por menú/pestañas (Ionic tab bar). Sin auth.  
- Títulos y meta por ruta para SEO.  
- Tema visual: azul como color primario, fondo claro, layout que en desktop se vea “web” (contenido centrado, max-width) y en móvil igual pero adaptado.

Un resumen del plan está (o estuvo) en `PLAN-AL-DIA-v0.md` en la raíz del repo; si no existe, este documento reemplaza ese contexto.

---

## 6. Estructura del proyecto AlDia (implementado)

```
AlDia/
├── public/
├── src/
│   ├── components/
│   │   └── NavTabs.tsx          # Barra de pestañas (bottom)
│   ├── pages/
│   │   ├── Home.tsx             # Inicio con links tipo card a cada herramienta
│   │   ├── Dolar.tsx            # Cotizador dólar (tipo, ARS/USD, conversión)
│   │   ├── CuantoVale.tsx       # Precio USD → ARS (blue, MEP, CCL, tarjeta)
│   │   ├── CuentaPropina.tsx    # Dividir cuenta (partes iguales) + Propina (%)
│   │   ├── Alquiler.tsx         # Máximo a pagar de alquiler según ingresos
│   │   └── AumentoAlquiler.tsx  # Próximo aumento ICL (API BCRA + fallback)
│   ├── hooks/
│   │   ├── useCotizacion.ts     # DolarAPI, estado, getByTipo, “actualizado hace X min”
│   │   ├── useCuenta.ts         # Estado cuenta/propina, shareUrl (query params)
│   │   └── usePageTitle.ts      # document.title y meta description por ruta
│   ├── services/
│   │   ├── cotizacion.ts        # fetchDolares, cache 5 min, getDolarByCasa
│   │   └── indicesBcra.ts       # fetchIcl (7988), cache 24h, getIclEnFecha, fallback JSON
│   ├── types/
│   │   └── cotizacion.ts        # DolarItem, TipoDolar, TIPOS_DOLAR
│   ├── data/
│   │   └── indicesIclFallback.json   # Fallback ICL si API BCRA falla
│   ├── theme/
│   │   └── variables.css        # Tema azul, Ionic vars, .content-wrap, .link-card
│   ├── App.tsx                  # IonApp, IonReactRouter, IonTabs, Rutas
│   └── main.tsx                 # Ionic CSS, theme, setupIonicReact
├── capacitor.config.ts          # appId: ar.aldia.app, appName: Al Día, webDir: dist
├── firebase.json                # hosting public: dist
├── .firebaserc                  # default project: aldia-ee57e
├── package.json                 # scripts: dev, build, deploy
└── README.md                    # Instrucciones v0 y pasos para app nativa
```

**Rutas:** `/`, `/dolar`, `/cuanto-vale`, `/cuenta`, `/alquiler`, `/aumento-alquiler`.

---

## 7. Tema y UI

- **Color primario:** azul `#1e5fba` (toolbar, botones, tab seleccionado, acentos).
- **Fondo:** `#f0f4fa`. Texto: `#1e293b`.
- **Toolbar:** Fondo primario, texto blanco.
- **Tab bar:** Fondo blanco; tab seleccionado en azul; en desktop centrado con max-width y bordes redondeados.
- **Cards:** Bordes redondeados, sombra suave; en Home los links son “link-card” (título azul, hover con elevación).
- **Desktop (≥768px):** Contenido con `.content-wrap` (max-width 640px centrado); tab bar centrado max-width 720px.

Tema definido en `src/theme/variables.css`; importado en `main.tsx` después de los CSS de Ionic.

---

## 8. Comandos

- **Desarrollo:** `npm install` y `npm run dev` (ej. http://localhost:5173).  
- **Build:** `npm run build` → salida en `dist/`.  
- **Deploy:** `npm run deploy` (build + firebase deploy). Antes: `npx firebase login` si hace falta.

---

## 9. Lo que NO está en v0 (para después)

- Auth y guardado de historial (versión “pro”).  
- Export PDF.  
- Afiliados (placeholders o enlaces fijos).  
- Expensas + alquiler (“costo real del mes”) como extensión de la calculadora.  
- App nativa: Capacitor listo; falta `cap add ios/android`, build y `cap sync` cuando se decida.

---

## 10. Cómo usar este contexto en otra ventana/agente

- Abrí la carpeta del repo (o la carpeta `AlDia` si trabajás solo ahí).  
- Pasale a Cursor/agente este archivo o su contenido (por ejemplo: “Tomá el contexto de CONTEXTO-AL-DIA.md”).  
- Podés añadir en el mensaje qué querés hacer a continuación (ej.: “agregar X”, “cambiar el tema a Y”, “preparar deploy a producción”).

Con esto otro agente o vos en otra ventana tenés el contexto completo del proyecto Al Día y lo ya desarrollado.
