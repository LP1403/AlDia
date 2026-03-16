# TODO Al Día – Completado

- [x] Los labels tienen fondo transparente y se fusionan con el fondo de la app (variables + ion-content --background).
- [x] Border radius homogéneo: `--app-radius: 12px` y `--app-radius-sm: 8px` en toda la app (cards, inputs, link-cards, botones).
- [x] Labels y paddings homogéneos: mismo estilo en todos los `.form-field`, `margin-bottom: 0.625rem` en labels, sin encimar.
- [x] Títulos en el header: cada página muestra su título en `IonTitle` (Cotizador dólar, Cuánto vale en pesos, etc.) y se quitaron los `h1` del contenido; las descripciones quedan como `.content-intro`.
- [x] Leyenda de cotización: "Actualizado hace X" usa horas y días cuando corresponde (ej. "1 hora y 5 min", "1 día y 2 horas") vía `actualizadoHaceTexto()` en `useCotizacion`.
