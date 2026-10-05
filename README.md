# NUDO — Botica contemporánea

Demo de e-commerce de cuidado capilar y personal, de fidelidad alta/semi-alta, desarrollado exclusivamente con HTML, CSS y JavaScript nativos. Dirección visual inclusiva: porcelana, verde bosque, salvia y coral; tipografía del sistema y serif editorial; envases dibujados con CSS. Sin dependencias, imágenes o fuentes externas, backend ni llamadas a API.

## Archivos

- `index.html`: estructura semántica, navegación, enlace para saltar al contenido, región de anuncios accesibles y pie.
- `styles.css`: variables de color, composición editorial, ilustraciones de envases, tarjetas, checkout y adaptación móvil/escritorio.
- `script.js`: 22 productos, filtros simples por categoría, rutas hash, carrito persistente, validación, guards y pago simulado.
- `README.md`: uso, alcance y límites del demo.

## Uso y flujo

Abre `index.html` en un navegador moderno con JavaScript activado. No requiere instalaciones ni conexión. También puede servirse con un servidor estático que ya tengas disponible.

Inicio → Productos → Detalle → Carrito → Datos de envío → Pago simulado → Confirmación.

Rutas: `#inicio`, `#productos`, `#detalle/shampoo` (o el identificador de cualquier producto), `#carrito`, `#envio`, `#pago` y `#confirmacion`. Los filtros usan `#productos/0`, `#productos/1` y `#productos/2`, de modo que atrás/adelante también restaure la categoría elegida. Las rutas desconocidas regresan al catálogo.

El Home (inicio) rediseñado comparte el primer viewport de escritorio entre el hero, cinco enlaces de colección y dos mini productos. En móvil, los accesos de colección usan un rail horizontal accesible con dos accesos completos y productos compactos visibles. Las colecciones filtradas de shampoos y acondicionadores se abren mediante `#productos/coleccion-shampoos` y `#productos/coleccion-acondicionadores`, respectivamente. Las tres categorías del catálogo siguen siendo Cabello, Estilo y barba y Cuidado personal. Incluye las secciones Cuidado diario, Peinado y fijación, Tratamientos, Cuidado de barba y Más vendidos, con cuatro productos por sección y las mismas tarjetas reutilizadas del catálogo. El enlace «Ver todos» de cada sección abre el catálogo para ver esa colección mediante las rutas `#productos/coleccion-diario`, `#productos/coleccion-peinado`, `#productos/coleccion-tratamientos`, `#productos/coleccion-barba` y `#productos/coleccion-mas-vendidos`, respectivamente. El catálogo contiene 22 productos y mantiene las tres categorías. Los artículos mostrados en Home se reutilizan: no son productos duplicados en el catálogo ni entradas duplicadas en el carrito; agregar de nuevo el mismo artículo incrementa su cantidad. Precios ficticios en USD. El carrito permite cantidades de 1 a 99 por producto, eliminación, subtotales y total; el envío simulado es gratuito.

Envío y pago requieren un carrito con artículos. Pago también exige datos de envío validados; modificar el carrito obliga a revisar de nuevo el formulario. Son obligatorios primer nombre, primer apellido, correo, provincia, ciudad y dirección / calle y número. Segundo nombre, segundo apellido, complemento/departamento, celular y código postal son opcionales; Ecuador es el país de envío fijo. Los errores inline se asocian mediante aria-describedby/aria-invalid, se limpian al editar y el primer error recibe foco al enviar. Usa datos ficticios.

Confirmar vacía el carrito, borra los datos personales y sustituye la entrada de pago del historial. Volver atrás no repite el pago; los guards impiden reabrirlo sin carrito y envío válido. Confirmación requiere un pedido creado durante la sesión. Recargar no conserva el pedido confirmado.

## Persistencia y privacidad

Solo se guarda el carrito en `localStorage`, bajo `nudo-cart-v1`, como identificadores y cantidades. La carga defensiva descarta formatos incorrectos, productos desconocidos, duplicados y cantidades inválidas; obtiene precios y descripciones del catálogo local. Si el almacenamiento está bloqueado, el flujo sigue funcionando en memoria y anuncia la limitación al modificar el carrito. La persistencia al abrir mediante `file://` depende del navegador.

Los datos de envío y el estado del checkout viven exclusivamente en memoria. Nunca se guardan en localStorage, sessionStorage ni cookies, ni se transmiten. Se borran al confirmar o recargar; también se borran al vaciar manualmente el carrito. No hay campos bancarios, cobros, correos ni envíos reales. Las características de los productos y sus ilustraciones son demostrativas, no una oferta comercial.

## Accesibilidad y comprobación

Incluye títulos semánticos, etiquetas y mensajes de error vinculados, foco visible, enlaces de retorno, stepper con paso actual, controles táctiles de al menos 44 px, arte con descripciones accesibles y anuncios de cambios del carrito. Respeta la preferencia de movimiento reducido.

Verificación de sintaxis: `node --check script.js`.

Revisión manual sugerida en 390 × 844 y 1237 × 844: inicio, accesos rápidos y sus cinco secciones de cuatro productos; apertura de cada colección en el catálogo; catálogo de 22 productos y filtros; detalle y agregar; modificar/eliminar cantidades; recargar para comprobar persistencia; formulario vacío, correo incorrecto y datos ficticios válidos; pago y confirmación; atrás/adelante tras confirmar; acceso directo a pasos protegidos; carrito vacío. También comprobar navegación por teclado y ausencia de desbordamiento horizontal.

Este prototipo no incluye búsqueda, favoritos, reseñas, cupones ni recomendaciones.

## Estado de la verificación

`node --check script.js` pasó sin errores.

Se revisaron visualmente el inicio y el catálogo en escritorio y móvil. La medición actual en móvil, con viewport de 390 × 844 px, no presenta desbordamiento (overflow): los productos compactos están completamente visibles hasta y=696. En escritorio, con viewport de 1237 × 844 px, el hero mide 410 px y se ven los cinco enlaces de colección y los dos mini productos en el primer viewport.

Se probaron el filtro de categoría, la persistencia del carrito tras recargar, los cambios de cantidades, la validación del envío incompleto y del correo inválido, el pago sin campos bancarios, la confirmación y volver atrás.

## Envío en Ecuador

Se conserva el select offline de las 24 provincias ecuatorianas. Ciudad es texto requerido; no hay campo de cantón. Cambiar provincia borra ciudad, dirección, complemento y postal tanto del formulario como de la memoria. Dirección / calle y número es requerida; complemento/departamento es opcional.

Primer nombre y primer apellido son requeridos; segundo nombre y segundo apellido son opcionales. Cada valor presente admite letras Unicode, marcas de acento, espacios, guiones y apóstrofes, con un mínimo de dos letras. El resumen concatena los cuatro componentes en ese orden y escapa todos los datos personales. El correo conserva la validación nativa. Los textos salvo celular y postal tienen máximo 160 caracteres.

Celular es opcional. El select adyacente identifica exclusivamente el país del celular, con valores ISO, nombres mediante `Intl.DisplayNames(['es'], {type: 'region'})` (fallback al ISO), orden español y prefijo visible. Ecuador +593 está preseleccionado. Las 245 regiones se ofrecen por separado, incluso cuando comparten prefijo, como Estados Unidos y Canadá +1. El país de envío permanece Ecuador.

El número usa `inputmode="numeric"`; al escribir o pegar se eliminan caracteres distintos de dígitos ASCII. No se escribe el prefijo en el campo. `maxlength` se calcula como 15 menos los dígitos del prefijo y la validación vuelve a comprobar ese límite. Ecuador requiere nueve dígitos empezando en 9, sin cero inicial; otros países solo se comprueban por dígitos y límite total E.164. Al cambiar el país no se trunca un número existente: se señala el error cuando corresponde. El resumen añade +prefijo al número. No se validan fijos ni se consulta operador, existencia, titularidad o disponibilidad del celular.

Fuente del dataset: mapa de regiones y dial codes de los metadatos de **libphonenumber-js 1.12.6**, proporcionado con la petición y vendorizado en `script.js` el **5 de octubre de 2026**, día de ejecución. Es una instantánea de esa versión, no una afirmación de que sea la versión más reciente. No se instala ni ejecuta la librería y no hay consultas de red para cargar o actualizar los prefijos.

Código postal es opcional, sin validación de longitud o regex ni inferencia por provincia o ciudad. Su única ayuda es «Consulte su Código Postal en:» y un enlace a la fuente oficial, [Código Postal Ecuador](https://www.codigopostal.gob.ec/), con `target="_blank" rel="noopener"`. Consultarlo manualmente requiere conexión.

No se solicita cédula, RUC, nacimiento ni datos bancarios. Los datos personales viven solo en memoria y se borran al confirmar o recargar. `localStorage` conserva únicamente el carrito. Este prototipo no constituye asesoría legal ni certificación de cumplimiento oficial.

## Verificación local del checkout actualizado — 5 de octubre de 2026

`node --check script.js` y `git diff --check` correctos. Chrome headless real, servidor local, perfil temporal y datos ficticios: 31 comprobaciones correctas sobre nombres requeridos/opcionales, errores inline y foco, 245 regiones/prefijos compartidos/orden español, Ecuador por defecto, sanitización de input y paste, celular vacío, reglas ecuatorianas, límite E.164 y cambio de prefijo, provincia/ciudad/dirección requeridas, limpieza de zona, postal vacío/libre y enlace, resumen legible y escape HTML, ausencia de campos innecesarios, persistencia limitada al carrito y confirmación.

Además, recargar borra los datos personales y conserva el carrito. A 390 × 844 y 1237 × 844 px se midió ausencia de desbordamiento horizontal y altura de al menos 44 px en los controles y enlaces del formulario. Son comprobaciones DOM en Chrome; no sustituyen revisión visual, lector de pantalla, autocompletado real o compatibilidad entre navegadores. No se realizó redeploy.
