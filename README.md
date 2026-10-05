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

Envío y pago requieren un carrito con artículos. Pago también exige datos de envío validados; modificar el carrito obliga a revisar de nuevo el formulario. Los seis campos son obligatorios, rechazan valores vacíos o solo espacios y validan el formato del correo. Los errores aparecen junto al campo y reciben foco al enviar. Usa datos ficticios.

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
