# NUDO — Botica contemporánea

Tienda estática de cuidado capilar y personal en HTML, CSS y JavaScript nativos, con 60 productos, colecciones, detalle, carrito y checkout. Ilustraciones CSS y fuentes del sistema; sin backend, procesador de pagos ni certificación de seguridad o accesibilidad. No existen compras, cobros, correos ni entregas reales.

## Actualización UI/UX — 7 de octubre de 2026

El encabezado incluye iconos SVG locales para Inicio, Productos, Carrito y búsqueda. El cuadro de búsqueda se despliega junto a la lupa, busca nombre, categoría, descripción, etiqueta y beneficios sin distinguir tildes, y permite filtrar por categoría y rango de precio u ordenar por precio, nombre u orden de lista. Los mismos controles están disponibles en el catálogo y en los resultados de búsqueda; sus selecciones se reflejan en la ruta para conservar el estado al navegar. Las fichas muestran productos relacionados por categoría y colección. La portada y el catálogo muestran una fila de productos por categoría, adaptable al ancho de pantalla; «Ver todos» abre la categoría completa y mantiene las otras categorías visibles con su propia fila de productos. El catálogo incluye 60 productos y cinco categorías, entre ellas Rizos y ondas y Cuero cabelludo. Los precios usan el símbolo `$` una sola vez, delante del importe, con mayor jerarquía visual. El carrito confirma antes de quitar un artículo y ofrece vaciar todo. El pie presenta correo, teléfonos y dirección en un diseño adaptable.

La búsqueda queda anclada al botón de lupa, usa un solo icono y se cierra al hacer clic fuera. La cabecera permanece fija al desplazarse. En el resumen, la fila de envío solo aparece al elegir entrega a domicilio; para pagos/retiros se omite. El ticket de pago local no se presenta como ticket de retiro; los tickets de retiro o envío se muestran en el flujo en línea. Cada ticket incluye un código aleatorio de referencia, sin consulta automática ni verificación en servidor.

## Archivos y regla_runtime

- `index.html`: estructura, navegación, búsqueda e iconos locales; integra `intl-tel-input` 25.12.2 por CDN para selector de país con búsqueda y banderas.
- `script.js`: catálogo, rutas hash, búsqueda tolerante a tildes, carrito, contacto, validación de prueba y tickets.
- `styles.css`: presentación adaptable, iconografía SVG local, controles nativos y bandera/prefijo separados.
- `README.md` y `AUDITORIA.md`: uso, alcance, evidencias y limitaciones.

El historial de auditoría de la publicación en el commit `70597e0` se conserva como referencia documental. **Recursos externos en runtime:** `intl-tel-input` 25.12.2 (JavaScript, CSS y sprites de banderas) se carga desde jsDelivr; si el CDN no está disponible, queda el selector nativo de países con fallback de bandera. También se conserva el fallback de imagen de bandera desde FlagCDN. No hay analítica, API de pago ni consultas automáticas de teléfonos o direcciones. El enlace de ayuda al portal de código postal se abre solo por acción del usuario.

Abre `index.html` en un navegador moderno o sirve la carpeta con un servidor estático local. Las banderas gráficas necesitan conexión; si fallan, se muestra `countryFlag` Unicode o un símbolo global. La tienda no necesita instalar dependencias. La búsqueda y los filtros de categoría, precio y orden se ejecutan en el navegador; las tarjetas permiten agregar al carrito sin salir del catálogo. Rutas principales: `#inicio`, `#productos`, `#buscar/shampoo`, `#detalle/shampoo`, `#carrito`, `#envio`, `#pago`, `#confirmacion`; los criterios activos se guardan como parámetros de la ruta.

## Tres pasos exactos

1. **Datos de compra/contacto:** primer nombre, primer apellido, correo y celular obligatorios; segundo nombre, segundo apellido y fijo opcionales. No hay dirección ni CP en este paso.
2. **Pago:** permite elegir pago en el local o pago en línea. El pago en el local crea un ticket de pago pendiente. La opción en línea valida los campos y presenta el pago como confirmado, con entrega a casa (predeterminada) o retiro. Es una presentación estática: no hay procesador ni cobro real.
3. **Confirmación:** el pago pendiente genera un ticket de pago; la opción en línea genera ticket de retiro o envío según la entrega. Todos incluyen un código aleatorio de referencia. Ticket y resumen omiten nombre, contacto y dirección personal.

| Fulfillment | Ticket/estado | Envío simulado |
| --- | --- | --- |
| `local-pickup` | Ticket de pago pendiente; retiro previsto en 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-pickup` | Pago presentado como confirmado; ticket de retiro en 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-home` | Pago presentado como confirmado; ticket de envío a casa | Fijo $5,00 |

Solo online/home muestra Ciudad, Dirección, Complemento opcional y CP. En su submit se recortan espacios exteriores y se exige CP de exactamente seis dígitos; nunca se trunca ni se infiere de la ciudad. Ciudad/dirección son obligatorias. Los retiros no muestran ni validan destino. Una sola función `deliveryFee` define el cargo: 500 centavos exclusivamente para online/home. El pedido guarda `deliveryFee` numérico en centavos, `fulfillment`, modalidad de pago, código de referencia y artículos. El código sirve para identificar visualmente el ticket; sin backend no se puede verificar en otro dispositivo.

## Formato de pago

Los campos de tarjeta se muestran únicamente al elegir pago en línea. El número debe tener de 12 a 19 dígitos y superar la validación de Luhn; también admite espacios o guiones como separadores. El vencimiento requiere mes `01`–`12` y año de dos dígitos, y el CVV admite 3 o 4 dígitos. La barra del vencimiento se inserta al escribir. No se comprueba una tarjeta fija, no se verifica el titular ni se conecta a un procesador.

Los valores de tarjeta no se copian al objeto `payment`, el pedido, el almacenamiento ni las solicitudes; cambiar de modalidad reconstruye los inputs y confirmar elimina la pantalla de pago. Los errores aparecen mientras se escribe, al salir del campo y al enviar, asociados mediante `aria-describedby` y `aria-invalid`; el envío enfoca el primer campo inválido. La entrega a casa valida ciudad, dirección y código postal mientras se completan. El destino se escapa al reconstruir inputs y las alertas usan texto.

## Celular y país

`intl-tel-input` 25.12.2 en JavaScript nativo proporciona selector con búsqueda por país o prefijo y muestra las banderas tanto en la opción seleccionada como en los resultados. Ecuador es el valor predeterminado; al cambiar de país se actualiza el prefijo y el límite de dígitos. Si no carga el CDN, sigue disponible el selector nativo con bandera de fallback.

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
