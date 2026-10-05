# NUDO — Botica contemporánea

Prototipo de tienda de cuidado capilar y personal en HTML, CSS y JavaScript nativos. Catálogo de 22 productos, colecciones, detalle, carrito y checkout simulado. Ilustraciones CSS y fuentes del sistema; sin backend, procesador de pagos ni certificación de seguridad o accesibilidad. No existen compras, cobros, correos ni entregas reales.

## Archivos y regla_runtime

- `index.html`: estructura, navegación y pie con aviso de demostración. No modificado en esta actualización.
- `script.js`: catálogo, rutas hash, carrito, contacto, validación de prueba y tickets.
- `styles.css`: presentación adaptable, controles nativos y bandera/prefijo separados.
- `README.md` y `AUDITORIA.md`: uso, alcance, evidencias y limitaciones.

El alcance de esta actualización comprende únicamente `script.js`, `styles.css`, `README.md` y `AUDITORIA.md`. **regla_runtime:** el único recurso externo automático es la imagen de bandera en `https://flagcdn.com/w40/${iso.toLowerCase()}.png`. Sí es un CDN externo en runtime; no se afirma cero recursos externos. No hay librerías remotas, analítica, API de pago ni consultas automáticas de teléfonos o direcciones. El enlace de ayuda al portal de código postal se abre solo por acción del usuario.

Abre `index.html` en un navegador moderno o sirve la carpeta con un servidor estático local. Las banderas gráficas necesitan conexión; si fallan, se muestra `countryFlag` Unicode o un símbolo global. La tienda no necesita instalar dependencias. Rutas principales: `#inicio`, `#productos`, `#detalle/shampoo`, `#carrito`, `#envio`, `#pago`, `#confirmacion`; se conservan filtros por categoría y colección.

## Tres pasos exactos

1. **Datos de compra/contacto:** primer nombre, primer apellido, correo y celular obligatorios; segundo nombre, segundo apellido y fijo opcionales. Usa datos ficticios. No hay dirección ni CP. Carrito y contacto muestran envío «Se define en Pago».
2. **Pago:** local predeterminado y botón **Continuar**. No solicita destino ni tarjeta; genera un retiro para pagar en el local. Online muestra tarjeta de prueba y entrega a casa (predeterminada) o retiro. Cambiar modalidad actualiza controles, aviso local, botón y totales inmediatamente, sin pasos adicionales.
3. **Confirmación:** ticket y resumen sin nombre, contacto ni dirección personal. No afirma un cobro real.

| Fulfillment | Ticket/estado | Envío simulado |
| --- | --- | --- |
| `local-pickup` | Ticket de retiro; **Pago pendiente en el local**; 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-pickup` | Ticket de retiro; **pago en línea simulado**; 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-home` | Ticket de envío a casa; **pago en línea simulado** | Fijo $5.00 USD, mostrado como 5,00 US$ |

Solo online/home muestra Ciudad, Dirección, Complemento opcional y CP. En su submit se recortan espacios exteriores y se exige CP de exactamente seis dígitos; nunca se trunca ni se infiere de la ciudad. Ciudad/dirección son obligatorias. Los retiros no muestran ni validan destino. Una sola función `deliveryFee` define el cargo: 500 centavos exclusivamente para online/home. El pedido guarda `deliveryFee` numérico en centavos y `fulfillment`, además de referencia y artículos.

## Tarjeta exclusivamente de prueba

Aviso prominente en Pago: **«DEMO: no uses datos reales. Solo se acepta la tarjeta de prueba indicada y no se envía ni guarda.»** Se mantienen los avisos de demostración del checkout y pie; el aviso superior también permanece visible en móvil.

Datos de prueba publicados: **PAN 4242 4242 4242 4242, fecha 12/30, CVV 123**. El PAN solo es válido si, al quitar espacios, coincide exactamente con `4242424242424242`; cualquier otro se rechaza. Se eliminan caracteres ajenos a dígitos/espacios al editar el PAN. Fecha en MM/YY, con mes válido y no vencida; CVV exactamente 123. No uses tarjetas reales. El formulario es visual y valida una demostración, sin procesador real.

Los tres inputs aparecen únicamente online, con labels accesibles «Card number», «Fecha (MM/YY)» y «CVV», `autocomplete="off"` e `inputmode="numeric"`. Sus valores se leen directamente del formulario al submit: nunca entran en `payment`, pedido, referencia, almacenamiento ni requests. Cambiar modalidad reconstruye los inputs vacíos; confirmar descarta el DOM de Pago. Errores inline asociados por `aria-describedby`, `aria-invalid` y foco al primer inválido. El destino se escapa al reconstruir inputs; las alertas usan texto.

## Celular y país

Selector nativo accesible de 245 regiones. Cada opción contiene **solo el nombre localizado**, sin bandera, sigla ISO ni prefijo repetido. Ecuador es el predeterminado. La bandera real se muestra fuera del select como imagen de 24 × 18, alt descriptivo, `loading="eager"`, `referrerpolicy="no-referrer"`; src/alt cambian con el país y `onerror` usa `countryFlag` Unicode/global. El prefijo aparece en etiqueta visual separada (+593 inicialmente).

Se conservan los metadatos locales de libphonenumber-js 1.12.6, sin instalar su librería. Celular: dígitos solamente; Ecuador exige nueve empezando en 9, sin cero inicial; internacional admite hasta 15 contando prefijo. Fijo opcional ecuatoriano: `0[2-7]` y siete dígitos, permitiendo espacios/guiones de presentación. Estas reglas no comprueban existencia o titularidad. Nombres admiten letras Unicode, espacios, guiones y apóstrofes, con al menos dos letras; correo requiere usuario, @ y dominio con punto.

## Persistencia y privacidad

Solo `localStorage['nudo-cart-v1']` guarda cart: identificadores y cantidades. No se escriben cookies ni sessionStorage. Contacto/destino viven en memoria y DOM hasta confirmar, recargar o vaciar el carrito. `emptyPayment` contiene exclusivamente method, delivery y destination; `editPayment` nunca guarda tarjeta. Confirmación no incluye PII ni datos de tarjeta.

Confirmar vacía el carrito, contacto y borrador; sustituye Pago en el historial. Los guards exigen carrito/contacto validado y bloquean confirmación sin pedido. Cambiar carrito invalida contacto validado. La persistencia no sincroniza pestañas ni tiene caducidad; un fallo de escritura puede dejar un carrito anterior (H01–H03 de AUDITORIA). El autocompletado del navegador, extensiones y borrado forense están fuera de la garantía de la aplicación.

## Validación local — 5 de octubre de 2026

`node --check script.js` y `git diff --check` correctos. **Chrome 154.0.8037.93 headless**, servidor HTTP local UTF-8, perfil temporal y CDP, sin instalar dependencias: **73 aserciones correctas**.

- Tres pasos en contacto/Pago/confirmación; envío desconocido antes de Pago.
- 245 opciones de nombre solo, Ecuador/+593, atributos de imagen, cambio a US/+1 y fallback `onerror` provocado.
- Local predeterminado → Continuar → ticket pendiente con ubicación; sin destino ni tarjeta.
- Online/pickup → sin destino/CP → tarjeta obligatoria → ticket de retiro con pago simulado y ubicación.
- Online/home: destino visible, CP vacío/corto/largo/alfabético rechazado; CP válido con espacios exteriores aceptado; resumen $5 e importe total inmediato al alternar entrega; ticket de casa con cargo y sin PII.
- PAN diferente rechazado; fechas 01/20, 00/30, 13/30 y 1/30 rechazadas; CVV incorrecto rechazado; PAN exacto agrupado y sin espacios aceptado. ARIA y foco verificados.
- Tarjeta ausente del estado/pedido/almacenamiento; volver a local elimina inputs y regresar a online los deja vacíos. localStorage solo cart, sessionStorage vacío y sin cookies.
- Cadena HTML de prueba conservada como texto en destino sin crear elementos.
- Viewports 390 × 844 y 1237 × 844 sin overflow horizontal en contacto, local, online/home, online/pickup y confirmación.
- Cero excepciones JavaScript. Solicitudes observadas exclusivamente GET locales y al CDN flagcdn, sin payload de formulario ni PII/tarjeta en URL. No se usaron datos reales.

El primer intento del arnés no cargó correctamente; la ejecución completa pasó después de servir tipos MIME con charset UTF-8 explícito. Estas son pruebas locales automatizadas, no una certificación ni un nuevo despliegue. No se verificaron lector de pantalla, zoom, contraste, autocompletado real, otros navegadores ni entrega/pago reales. Las comprobaciones históricas de producción corresponden a versiones anteriores y se conservan en AUDITORIA.
