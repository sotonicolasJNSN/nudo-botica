# NUDO — Botica contemporánea

Prototipo de tienda de cuidado capilar y personal en HTML, CSS y JavaScript nativos. Catálogo de 40 productos, colecciones, detalle, carrito y checkout simulado. Ilustraciones CSS y fuentes del sistema; sin backend, procesador de pagos ni certificación de seguridad o accesibilidad. No existen compras, cobros, correos ni entregas reales.

## Actualización UI/UX — 7 de octubre de 2026

El encabezado incluye iconos SVG locales para Inicio, Productos, Carrito y búsqueda. El cuadro de búsqueda se despliega lateralmente junto a la lupa, filtra nombre, categoría, descripción y etiqueta sin distinguir tildes, y permite agregar resultados al carrito. Las fichas muestran productos relacionados por categoría y colección. La portada y el catálogo muestran una fila de productos por categoría, adaptable al ancho de pantalla; «Ver todos» abre la categoría completa y mantiene las otras categorías visibles con su propia fila de productos. El catálogo incluye 40 productos y cinco categorías, entre ellas Rizos y ondas y Cuero cabelludo. El pie presenta correo, teléfonos y dirección en un diseño adaptable.

La búsqueda queda anclada al botón de lupa, usa un solo icono y se cierra al hacer clic fuera. En el resumen, la fila de envío solo aparece antes de elegir la entrega o al seleccionar domicilio; para retiros se omite. El ticket de retiro no muestra cargos ni datos de envío. La aclaración de pago no procesado aparece una sola vez al final del checkout, en la confirmación.

## Archivos y regla_runtime

- `index.html`: estructura, navegación, búsqueda e iconos locales.
- `script.js`: catálogo, rutas hash, búsqueda tolerante a tildes, carrito, contacto, validación de prueba y tickets.
- `styles.css`: presentación adaptable, iconografía SVG local, controles nativos y bandera/prefijo separados.
- `README.md` y `AUDITORIA.md`: uso, alcance, evidencias y limitaciones.

El historial de auditoría de la publicación en el commit `70597e0` se conserva como referencia documental; la actualización UI/UX del 7 de octubre sí modifica `index.html`, `script.js` y `styles.css`. **regla_runtime:** el único recurso externo automático es la imagen de bandera en `https://flagcdn.com/w40/${iso.toLowerCase()}.png`. Sí es un CDN externo en runtime; no se afirma cero recursos externos. No hay librerías remotas, analítica, API de pago ni consultas automáticas de teléfonos o direcciones. El enlace de ayuda al portal de código postal se abre solo por acción del usuario.

Abre `index.html` en un navegador moderno o sirve la carpeta con un servidor estático local. Las banderas gráficas necesitan conexión; si fallan, se muestra `countryFlag` Unicode o un símbolo global. La tienda no necesita instalar dependencias. La lupa del encabezado busca nombre, categoría y descripción sin distinguir tildes; las tarjetas permiten agregar al carrito sin salir del catálogo. Rutas principales: `#inicio`, `#productos`, `#buscar/shampoo`, `#detalle/shampoo`, `#carrito`, `#envio`, `#pago`, `#confirmacion`; se conservan filtros por categoría y colección.

## Tres pasos exactos

1. **Datos de compra/contacto:** primer nombre, primer apellido, correo y celular obligatorios; segundo nombre, segundo apellido y fijo opcionales. Usa datos ficticios. No hay dirección ni CP. Carrito y contacto muestran envío «Se define en Pago».
2. **Pago:** local predeterminado y botón **Continuar**. No solicita destino ni tarjeta; genera un ticket de retiro pendiente. Online permite revisar el formato de tarjeta y elegir entrega a casa (predeterminada) o retiro. No hay procesador, cobro ni envío real. Cambiar modalidad actualiza controles, aviso local, botón y totales inmediatamente.
3. **Confirmación:** ticket y resumen sin nombre, contacto ni dirección personal. No afirma un cobro real.

| Fulfillment | Ticket/estado | Envío simulado |
| --- | --- | --- |
| `local-pickup` | Ticket de retiro; **Pago pendiente en el local**; 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-pickup` | Ticket de retiro; **pago en línea simulado**; 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-home` | Ticket de envío a casa; **pago en línea simulado** | Fijo $5.00 USD, mostrado como 5,00 US$ |

Solo online/home muestra Ciudad, Dirección, Complemento opcional y CP. En su submit se recortan espacios exteriores y se exige CP de exactamente seis dígitos; nunca se trunca ni se infiere de la ciudad. Ciudad/dirección son obligatorias. Los retiros no muestran ni validan destino. Una sola función `deliveryFee` define el cargo: 500 centavos exclusivamente para online/home. El pedido guarda `deliveryFee` numérico en centavos y `fulfillment`, además de referencia y artículos.

## Formato de pago

Los campos de tarjeta se muestran únicamente al elegir pago en línea. La validación es de formato: número de 12 a 19 dígitos, vencimiento con mes `01`–`12` y año de dos dígitos, y CVV de 3 o 4 dígitos. La barra del vencimiento se inserta al escribir. No se comprueba una tarjeta fija, no se verifica el titular ni se conecta a un procesador; el aviso junto a los campos indica que no se ingresen datos reales.

Los valores de tarjeta no se copian al objeto `payment`, el pedido, el almacenamiento ni las solicitudes; cambiar de modalidad reconstruye los inputs y confirmar elimina la pantalla de pago. Los errores aparecen mientras se escribe, al salir del campo y al enviar, asociados mediante `aria-describedby` y `aria-invalid`; el envío enfoca el primer campo inválido. La entrega a casa valida ciudad, dirección y código postal mientras se completan. El destino se escapa al reconstruir inputs y las alertas usan texto.

## Celular y país

Selector nativo accesible de 245 regiones. Cada opción contiene **solo el nombre localizado**, sin bandera, sigla ISO ni prefijo repetido. Ecuador es el predeterminado. La bandera real se muestra fuera del select como imagen de 24 × 18, alt descriptivo, `loading="eager"`, `referrerpolicy="no-referrer"`; src/alt cambian con el país y `onerror` usa `countryFlag` Unicode/global. El prefijo aparece en etiqueta visual separada (+593 inicialmente).

Se conservan los metadatos locales de libphonenumber-js 1.12.6, sin instalar su librería. Celular: dígitos solamente; Ecuador exige nueve empezando en 9, sin cero inicial; internacional admite hasta 15 contando prefijo. Fijo opcional ecuatoriano: `0[2-7]` y siete dígitos, permitiendo espacios/guiones de presentación. Estas reglas no comprueban existencia o titularidad. Nombres admiten letras Unicode, espacios, guiones y apóstrofes, con al menos dos letras; correo requiere usuario, @ y dominio con punto.

## Persistencia y privacidad

Solo `localStorage['nudo-cart-v1']` guarda cart: identificadores y cantidades. No se escriben cookies ni sessionStorage. Contacto/destino viven en memoria y DOM hasta confirmar, recargar o vaciar el carrito. `emptyPayment` contiene exclusivamente method, delivery y destination; `editPayment` nunca guarda tarjeta. Confirmación no incluye PII ni datos de tarjeta.

Confirmar vacía el carrito, contacto y borrador; sustituye Pago en el historial. Los guards exigen carrito/contacto validado y bloquean confirmación sin pedido. Cambiar carrito invalida contacto validado. La persistencia no sincroniza pestañas ni tiene caducidad; un fallo de escritura puede dejar un carrito anterior (H01–H03 de AUDITORIA). El autocompletado del navegador, extensiones y borrado forense están fuera de la garantía de la aplicación.

## Validación local — 7 de octubre de 2026

`node --check script.js` y `git diff --check` correctos. En navegador local se comprobó que los errores de contacto, tarjeta y destino aparecen al escribir y desaparecen al corregir el valor; también se verificó la inserción automática de `/`, la aceptación del formato genérico y los recorridos hasta confirmación.

- Tres pasos en contacto/Pago/confirmación; envío desconocido antes de Pago.
- 245 opciones de nombre solo, Ecuador/+593, atributos de imagen, cambio a US/+1 y fallback `onerror` provocado.
- Local predeterminado → Continuar → ticket pendiente con ubicación; sin destino ni tarjeta.
- Online/pickup → sin destino/CP → campos de tarjeta de formato genérico → ticket de retiro sin cobro.
- Online/home: destino requerido y CP de seis dígitos; total de envío actualizado y ticket con cargo simulado.
- Número de tarjeta por longitud de dígitos, vencimiento MM/AA con barra automática y CVV de 3–4 dígitos; sin PAN permitido fijo.
- Tarjeta ausente del estado/pedido/almacenamiento; volver a local elimina inputs y regresar a online los deja vacíos. localStorage solo cart, sessionStorage vacío y sin cookies.
- Cadena HTML de prueba conservada como texto en destino sin crear elementos.
- Viewports 390 × 844 y 1237 × 844 sin overflow horizontal en contacto, local, online/home, online/pickup y confirmación.
- Cero excepciones JavaScript. Solicitudes observadas exclusivamente GET locales y al CDN flagcdn, sin payload de formulario ni PII/tarjeta en URL. No se usaron datos reales.

El primer intento del arnés no cargó correctamente; la ejecución completa pasó después de servir tipos MIME con charset UTF-8 explícito. Estas son pruebas locales automatizadas de la versión publicada, no una certificación ni pruebas completas del sitio público. No se verificaron lector de pantalla, zoom, contraste, autocompletado real, otros navegadores ni entrega/pago reales. La comprobación pública de esta versión se limita a lo registrado a continuación; las comprobaciones históricas se conservan en AUDITORIA.

## Revisión pública del commit 70597e0 — 5 de octubre de 2026

GitHub Pages confirmó el build del commit **`70597e09c612851efcf48118d8302d34e1d06784`** (`70597e0`), status **`built`**, error **`null`**. La versión está publicada en [NUDO](https://sotonicolasjnsn.github.io/nudo-botica/). En el navegador público se comprobó:

- Checkout de exactamente tres pasos.
- Pago local predeterminado: CTA **Continuar**, cero inputs de tarjeta o destino y aviso **Pago pendiente en el local**, con ubicación **12 de Octubre y Veintimilla**.
- Al cambiar a online aparecen tres campos de formato de tarjeta; con entrega home aparecen cuatro campos de destino.
- Al cambiar a online/pickup desaparece el destino; el checkout conserva tres pasos.
- El carrito de prueba se borró al terminar.

La comprobación pública registrada corresponde a una versión histórica y no incluye el flujo actual. Los tickets local-pickup, online-pickup y online-home y las validaciones actuales se comprobaron en navegador **local**. No se afirma pago real, certificación ni prueba exhaustiva de producción.

El CDN flagcdn es el único recurso externo automático. La bandera actual es una imagen fuera del selector, con prefijo separado y opciones de solo nombre; sustituye la descripción anterior de bandera Unicode dentro de la opción.
