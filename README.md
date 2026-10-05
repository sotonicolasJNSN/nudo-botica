# NUDO — Botica contemporánea

Demo de e-commerce de cuidado capilar y personal, de fidelidad alta/semi-alta, desarrollado exclusivamente con HTML, CSS y JavaScript nativos. Dirección visual inclusiva: porcelana, verde bosque, salvia y coral; tipografía del sistema y serif editorial; envases dibujados con CSS. Sin dependencias, imágenes o fuentes externas, backend ni llamadas a API.

## Archivos

- `index.html`: estructura semántica, navegación, enlace para saltar al contenido, región de anuncios accesibles y pie.
- `styles.css`: variables de color, composición editorial, ilustraciones de envases, tarjetas, checkout y adaptación móvil/escritorio.
- `script.js`: 22 productos, filtros simples por categoría, rutas hash, carrito persistente, validación, guards y pago simulado.
- `README.md`: uso, alcance y límites del demo.

## Uso y flujo

Abre `index.html` en un navegador moderno con JavaScript activado. No requiere instalaciones ni conexión. También puede servirse con un servidor estático que ya tengas disponible.

Inicio → Productos → Detalle → Carrito. El checkout tiene exactamente tres pasos: **Datos de compra/contacto → Pago → Confirmación**.

Rutas: `#inicio`, `#productos`, `#detalle/shampoo` (o el identificador de cualquier producto), `#carrito`, `#envio`, `#pago` y `#confirmacion`. Los filtros usan `#productos/0`, `#productos/1` y `#productos/2`, de modo que atrás/adelante también restaure la categoría elegida. Las rutas desconocidas regresan al catálogo.

El Home (inicio) rediseñado comparte el primer viewport de escritorio entre el hero, cinco enlaces de colección y dos mini productos. En móvil, los accesos de colección usan un rail horizontal accesible con dos accesos completos y productos compactos visibles. Las colecciones filtradas de shampoos y acondicionadores se abren mediante `#productos/coleccion-shampoos` y `#productos/coleccion-acondicionadores`, respectivamente. Las tres categorías del catálogo siguen siendo Cabello, Estilo y barba y Cuidado personal. Incluye las secciones Cuidado diario, Peinado y fijación, Tratamientos, Cuidado de barba y Más vendidos, con cuatro productos por sección y las mismas tarjetas reutilizadas del catálogo. El enlace «Ver todos» de cada sección abre el catálogo para ver esa colección mediante las rutas `#productos/coleccion-diario`, `#productos/coleccion-peinado`, `#productos/coleccion-tratamientos`, `#productos/coleccion-barba` y `#productos/coleccion-mas-vendidos`, respectivamente. El catálogo contiene 22 productos y mantiene las tres categorías. Los artículos mostrados en Home se reutilizan: no son productos duplicados en el catálogo ni entradas duplicadas en el carrito; agregar de nuevo el mismo artículo incrementa su cantidad. Precios ficticios en USD. El carrito permite cantidades de 1 a 99 por producto, eliminación, subtotales y total; el envío simulado es gratuito.

## Checkout de tres pasos

1. **Datos de compra/contacto (`#envio`)**: primer nombre, primer apellido, correo y celular requeridos. Segundo nombre, segundo apellido y teléfono fijo opcionales. No se solicitan ciudad, dirección, provincia, cantón ni código postal. Ecuador es el contexto fijo de la compra.
2. **Pago (`#pago`)**: radios nativos agrupados en fieldsets, con presentación segmentada. «Pagar y retirar en el local» es la selección inicial y no muestra destino; su botón dice «Confirmar pago y retiro». «Pagar por línea» muestra entrega: «Enviar a casa» por defecto o «Retirar en el local», con botón «Simular pago en línea». Son controles dentro del paso Pago, nunca pasos adicionales.
3. **Confirmación (`#confirmacion`)**: resumen del carrito y del modo ficticio elegido, sin datos personales. No se solicitan tarjetas ni se procesan pagos reales.

Solo pago en línea + envío a casa muestra ciudad, dirección/calle y número, complemento opcional y código postal. Al enviar Pago, ciudad y dirección son requeridas y el CP debe contener exactamente seis dígitos. El CP no se deduce de la ciudad. Los dos modos de retiro no requieren destino ni CP. El panel muestra la regla y «Consulte su Código Postal en:» con enlace al portal oficial `https://www.codigopostal.gob.ec/`, abierto con `target="_blank" rel="noopener"`. Consultarlo requiere conexión; la aplicación no hace consultas automáticas.

Los errores inline tienen `aria-describedby` y `aria-invalid`, se limpian al editar y enfocan el primer campo inválido al enviar. Cambiar método o entrega limpia los errores, actualiza el botón y resumen y anuncia el modo mediante la región de estado. Los radios conservan la navegación nativa de teclado y sus etiquetas son clicables, sin roles de pestaña artificiales.

Los cuatro componentes del nombre admiten letras Unicode, acentos, espacios, guiones y apóstrofes, con al menos dos letras en cada componente presente; el resumen los concatena en orden y escapa los valores. El correo comprueba explícitamente una parte local, un único @, dominio con al menos un punto y ausencia de espacios, además de la validez nativa.

### Celular y fijo

El celular es obligatorio. El selector ofrece 245 regiones independientes, incluso US y CA con +1; nombres españoles mediante `Intl.DisplayNames` y fallback ISO. Ecuador +593 está preseleccionado. `countryFlag(ISO)` produce dos indicadores regionales Unicode, con símbolo neutro para códigos no estándar. Un `span` visible externo al `select` muestra `countryFlag` junto al control y se actualiza al cambiar de país; cada opción también incluye indicador, nombre y prefijo. La representación gráfica del indicador depende de las fuentes y del sistema operativo.

El celular admite solo dígitos ASCII: se sanitizan input y pegado, sin espacios, guiones ni prefijo escrito. Ecuador exige exactamente nueve dígitos empezando en 9, sin cero inicial. En regiones extranjeras el prefijo más el número admiten hasta 15 dígitos; no se comprueban los planes nacionales. Al cambiar país se conserva el número y se señala si excede el límite. El resumen muestra país, prefijo y celular.

El teléfono fijo es un campo separado y opcional, con placeholder «02 999 9999». Cuando se ingresa, valida el formato ecuatoriano `0[2-7]` seguido de siete dígitos; acepta espacios y guiones de presentación, eliminados solo para validar. No depende del país seleccionado para el celular. Estas reglas no acreditan existencia, titularidad ni entregabilidad.

Se mantienen `dialRegions` y `dialCodes`: instantánea proporcionada de metadatos de libphonenumber-js 1.12.6, vendorizada el 5 de octubre de 2026. No se instala la librería ni se añaden dependencias. Se eliminaron los datos y controles de provincia/cantón.

## Estado, persistencia y privacidad

Contacto y Pago requieren carrito; Pago exige contacto validado. Cambiar el carrito invalida esa preparación y obliga a revisar contacto, conservando el contacto y el borrador de pago/destino en memoria mientras queden artículos. El destino vuelve a validarse al enviar Pago. Cambiar de modo conserva el borrador sin exigir los campos ocultos.

Solo `localStorage['nudo-cart-v1']` persiste identificadores y cantidades del carrito. La carga descarta formatos incorrectos, productos desconocidos, duplicados y cantidades inválidas y recupera precios del catálogo local. No se guardan nombres, correo, teléfonos ni dirección en localStorage, sessionStorage o cookies. No se transmiten. Contacto y destino viven en variables/DOM y se borran al recargar, confirmar o vaciar el carrito. El autocompletado del navegador y sus extensiones quedan fuera de esa garantía de la aplicación.

Confirmar deshabilita el botón, crea un pedido en memoria con referencia, artículos y enum `fulfillment` (`local-pickup`, `online-home` u `online-pickup`), vacía carrito y datos personales y sustituye la entrada de Pago en el historial. Los guards bloquean volver a pagar sin carrito/contacto validado; la confirmación exige un pedido en memoria. Recargar no conserva el pedido.

Si falla el almacenamiento, el carrito sigue en memoria; no se garantiza eliminar una versión persistente anterior. Tampoco se sincronizan carritos entre pestañas ni hay caducidad. Véanse H01–H03 de AUDITORIA.md. No hay tarjetas, cobros, correos o entregas reales. El prototipo no incluye búsqueda, favoritos, reseñas ni cupones.

## Verificación local — 5 de octubre de 2026

Ejecutados `node --check script.js` y `git diff --check`, sin errores. Pruebas en **Chrome 154 headless real**, servidor HTTP local, perfil temporal y datos ficticios, sin instalar dependencias:

- Tres pasos exactos; contacto sin destino; 245 regiones, EC/indicadores Unicode/+593 y US/CA con prefijo compartido.
- Nombres requeridos y opcionales, concatenación; correos sin @, parte local, dominio, punto, con espacios o doble @; errores inline, limpieza y foco.
- Celular requerido, Ecuador válido/inválido, sanitización input/paste y límite internacional; fijo vacío, válido con separadores e inválido.
- Pago local sin destino, pago online/home con ciudad/dirección y CP vacío, de cinco/siete dígitos o alfanumérico bloqueados; CP válido de seis dígitos y enlace oficial.
- Cambios método/entrega, botón contextual, limpieza/anuncio y conservación del borrador; online/pickup sin CP; confirmaciones de los tres enums sin PII.
- Back y acceso a Pago tras confirmar bloqueados; cambio del carrito obliga a revisar contacto y conserva borrador; recarga borra PII y mantiene carrito; almacenamiento exclusivo de identificadores/cantidades.
- Viewports reales de 390 × 844 y 1237 × 844: contacto y ambos modos de Pago sin overflow horizontal, controles de contacto y etiquetas de radios de al menos 44 px. Capturas de Pago online/home revisadas en ambos tamaños, sin roturas observadas. Sin excepciones JavaScript durante el recorrido.

Las pruebas automatizan acciones DOM mediante Chrome DevTools Protocol; el pegado usa un evento con datos ficticios, no el portapapeles del sistema. No se certifica accesibilidad global: faltan lector de pantalla, autocompletado real, zoom, contraste, navegación completa por teclado y otros navegadores/dispositivos. Las medidas de controles no se extienden a todos los enlaces del sitio. La bandera gráfica depende del sistema operativo. No se contrastan direcciones ni teléfonos con servicios reales.

### Verificaciones manuales observadas

Según las observaciones manuales locales aportadas para esta versión:

- Pago y retiro local permite confirmar sin destino.
- Pago online con envío a casa bloquea la confirmación con CP inválido y permite confirmar con CP válido de seis dígitos y los demás campos requeridos completos.
- Pago online con retiro permite confirmar sin destino.
- El checkout mantiene exactamente tres pasos: Datos de compra/contacto, Pago y Confirmación.
- El celular es requerido; dejarlo vacío bloquea el avance.
- Estados Unidos +1 aparece con bandera/indicador y prefijo junto al control; las opciones incluyen indicador, nombre y prefijo. El celular extranjero aparece con su +prefijo en el resumen de contacto de Pago.
- La confirmación identifica el `fulfillment` elegido y no revela datos personales (PII).

Estas observaciones corresponden a la simulación: no acreditan verificación real de teléfono, pago o envío real, pruebas con lector de pantalla ni cumplimiento legal certificado.

El alcance permitido de esta versión comprende exactamente cuatro archivos: `script.js`, `styles.css`, `README.md` y `AUDITORIA.md`. Esta corrección documental modifica únicamente `README.md` y `AUDITORIA.md`; `index.html` permanece intacto. El commit `281a7e0` está desplegado y GitHub Pages reportó build status `built`, sin error, para `281a7e0efeddec5e2d5bdd83e838307a26f36f50`.

### Comprobación en producción posterior al despliegue de `281a7e0`

Según la prueba del sitio público en Chrome aportada por el usuario, la comprobación en producción fue de **carga y estructura básica del contacto**:

- La URL pública de Pages responde.
- En `#envio` se muestran exactamente tres pasos.
- Los inputs tienen los atributos `name`: `firstName`, `secondName`, `firstSurname`, `secondSurname`, `email`, `landline` (opcional) y `mobile` (requerido).
- El país predeterminado es `EC`; la bandera 🇪🇨 aparece en un `span` visible y la opción es «🇪🇨 Ecuador (+593)».
- No hay inputs de provincia ni cantón.
- El carrito de prueba se limpió después.

Esta comprobación no acredita pruebas funcionales en producción de todos los modos de pago y entrega; esos modos se probaron localmente.
