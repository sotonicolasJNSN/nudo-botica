# Auditoría del e-commerce estático NUDO

Fecha: 4 de octubre de 2026.

## Alcance y método

Revisión de `index.html`, `styles.css`, `script.js` y `README.md` para seguridad, privacidad, accesibilidad, usabilidad y preparación para GitHub Pages. Es una revisión acotada de código y lógica; no es una certificación, un pentest ni una declaración de conformidad normativa.

Se leyeron los cuatro archivos completos, se siguieron los flujos de entrada, almacenamiento y representación HTML, y se contrastaron las afirmaciones del README. Se ejecutó `node --check script.js` y un arnés temporal por entrada estándar de Node con contextos `vm`, sin crear archivos de pruebas. Se consultó documentación oficial de GitHub y MDN para almacenamiento y despliegue. La inspección del directorio se limitó a identificar la estructura de publicación; no se revisó el contenido de otros proyectos ni se buscaron o reprodujeron secretos.

El cierre posterior se limitó a seis archivos explícitos, excluyendo `.venv`, `IA` y `benchmarks` mediante staging explícito y `.gitignore`. Este cierre no amplía las comprobaciones de código descritas arriba; el estado de publicación consignado en H06 corresponde a la información posterior aportada.

Las referencias usan líneas de los archivos de la revisión histórica; pueden desplazarse tras la actualización del formulario. `styles.css:3` concentra muchas reglas; se indica también el selector para localizar la evidencia. Prioridades: P1 alta, P2 media, P3 baja. Se distingue entre un comportamiento confirmado, su impacto condicionado y una recomendación preventiva.

## Resumen por área

| Área | Resultado |
| --- | --- |
| Seguridad | Sin hallazgos confirmados de vulnerabilidades explotables en las entradas revisadas. No se confirmó XSS, extracción de datos ni ejecución de entradas del usuario. |
| Privacidad | No se confirmó transmisión o almacenamiento persistente de datos de envío por la aplicación. Hay persistencia del carrito sin caducidad y un límite de borrado cuando falla el almacenamiento. |
| Accesibilidad | Se confirmaron textos muy pequeños y una afirmación demasiado amplia sobre objetivos táctiles; no se declara incumplimiento WCAG a partir de esos datos. |
| Usabilidad | Se confirmó posibilidad de sobrescritura del carrito entre pestañas y pérdida de visibilidad del aviso superior de demo en móvil. |
| GitHub Pages | Cierre posterior: repositorio público y sitio publicado desde `main`, ruta `/`; API Pages con build status `built`, sin error, y HTTPS enforced `true`. Alcance y estado detallados en H06. |

Sin hallazgos confirmados de prioridad P1 dentro de este alcance. Esta ausencia no demuestra ausencia de vulnerabilidades.

## Hallazgos priorizados

### H01 — P2 · Carritos de distintas pestañas pueden sobrescribirse

**Evidencia:** `script.js:48,55-71` carga el carrito una sola vez y guarda una instantánea completa. Los manejadores de `script.js:127-201` no incluyen sincronización mediante el evento `storage`.

**Comprobación:** dos contextos aislados partieron del mismo carrito. Uno guardó un carrito vacío; el otro volvió a guardar su instantánea antigua. Se verificó que esa segunda escritura contenía de nuevo el producto. Esto reproduce la lógica de sobrescritura, no constituye una prueba de navegador con dos pestañas.

**Impacto:** otra pestaña puede reintroducir productos tras vaciar o confirmar, o perder cambios de cantidades. Afecta la coherencia de la simulación; no produce cobros.

**Recomendación:** manejar cambios de almacenamiento, revalidar el contenido con el catálogo y actualizar el estado visible. Invalidar la preparación del envío cuando cambie el carrito. Para escrituras simultáneas, definir una política de conflictos; escuchar el evento por sí solo no garantiza atomicidad. Comprobar vaciado, confirmación y edición concurrentes en dos pestañas.

### H02 — P2 · Un fallo al guardar impide garantizar el borrado del carrito persistente

**Evidencia:** `script.js:69-73` captura errores de escritura, mantiene la aplicación en memoria y anuncia una advertencia. Al confirmar, `script.js:163-166` vacía el carrito en memoria y llama a ese guardado. No puede eliminar el valor persistente anterior si la escritura falla.

**Impacto condicionado:** si ya existía un carrito guardado y una escritura posterior es rechazada, puede quedar la versión anterior y reaparecer cuando vuelva a ser legible. La advertencia afirma que el carrito se conservará solo durante la sesión, sin explicar que podría quedar una versión antigua. El envío sí se borra de las variables de la aplicación; este hallazgo no implica persistencia de datos personales de envío.

**Comprobación:** se probaron excepciones de lectura y escritura: no interrumpen la lógica y activan `storageWarning`. La conservación del valor previo se deduce del camino de error; no se reprodujo una política real de bloqueo en navegador.

**Recomendación:** devolver el resultado del guardado y distinguir entre cambios en memoria y persistencia confirmada. Mostrar una advertencia explícita sobre el posible carrito antiguo y cómo borrarlo desde el navegador cuando el acceso vuelva a estar disponible. No prometer borrado persistente cuando la API rechaza la operación.

### H03 — P3 · Carrito sin caducidad ni explicación visible de su duración

**Evidencia:** `script.js:44,55-71` usa `nudo-cart-v1`, sin fecha de creación, expiración ni ámbito específico del sitio. `README.md:28` documenta la persistencia; las vistas del carrito no explican su duración. Se almacenan únicamente identificadores y cantidades.

**Impacto:** una selección puede reaparecer en sesiones posteriores o quedar visible para otra persona que use el mismo perfil del navegador. Si se alojaran otras aplicaciones con la misma clave y origen, podrían compartir o sobrescribir ese valor; no se confirmó que existan. El almacenamiento se delimita por origen, no por ruta, según [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

**Recomendación:** añadir información breve en la interfaz sobre qué se conserva y un control para vaciar el carrito completo. Definir una caducidad acorde al demo y una clave específica del proyecto si comparte origen. No guardar datos de envío en esa estructura.

### H04 — P3 · Legibilidad reducida y alcance excesivo de la afirmación sobre controles táctiles

**Evidencia:** `styles.css:15,19,26-29,41` fija textos del inicio en 6–11 px, incluidos subtítulos y nombres de mini productos. Parte de los textos pertenece a ilustraciones, pero no todos. `README.md:34` afirma controles táctiles de al menos 44 px. Hay mínimos explícitos en botones y algunos enlaces, pero `styles.css:3` no garantiza ese tamaño para `.card h3 a` ni `.cart-row h2 a`.

**Impacto:** dificultad potencial de lectura y activación de enlaces pequeños, especialmente en móvil. La ausencia de un mínimo CSS no prueba por sí sola un objetivo efectivo menor de 44 px; el tamaño renderizado y el espaciado deben medirse. Tampoco un tamaño de fuente pequeño basta para declarar incumplimiento de WCAG.

**Recomendación:** aumentar textos informativos pequeños, comprobar objetivos efectivos y ajustar la afirmación del README a lo medido. Validar teclado, zoom de 200 % y 400 %, reflujo a 320 px y lector de pantalla. No reducir las etiquetas accesibles del arte para compensar problemas visuales.

### H05 — P3 · El aviso superior de demo desaparece en móvil

**Evidencia:** `index.html:14` sitúa «DEMO · SIN COBROS REALES» dentro de `.announcement span`; `styles.css:6` lo oculta con `display:none` a anchuras de hasta 700 px.

**Impacto:** quien llega al inicio desde un móvil pierde ese aviso temprano. El pie y el checkout mantienen avisos de simulación (`index.html:26`, `script.js:114,117,119,121`), por lo que no se afirma que el sitio oculte totalmente su condición ficticia.

**Recomendación:** conservar una indicación breve y visible de demo en la cabecera móvil y verificar su lectura sin desplazarse hasta el pie.

### H06 — Cerrado · Estado posterior de publicación en GitHub Pages

**Estado posterior:** el repositorio [sotonicolasJNSN/nudo-botica](https://github.com/sotonicolasJNSN/nudo-botica) es público. La fuente de GitHub Pages es la rama `main`, ruta `/`. La API Pages reportó build status `built`, sin error, y HTTPS enforced `true`. El sitio responde en [https://sotonicolasjnsn.github.io/nudo-botica/](https://sotonicolasjnsn.github.io/nudo-botica/) y [AUDITORIA.md](https://github.com/sotonicolasJNSN/nudo-botica/blob/main/AUDITORIA.md) es accesible en el repositorio.

**Alcance del cierre:** la revisión se limitó a seis archivos explícitos. Se excluyeron `.venv`, `IA` y `benchmarks` mediante staging explícito y `.gitignore`. Con la información posterior aportada, queda superada la afirmación de que la publicación estaba sin verificar y el conjunto de archivos sin delimitar. Este cierre no acredita pruebas funcionales, visuales o de seguridad adicionales ni modifica los hallazgos H01–H05.

**Recomendación vigente:** mantener una lista explícita de archivos publicables, revisar los cambios preparados antes de cada publicación y conservar documentadas la rama y carpeta seleccionadas. Incluir documentación solo cuando se desee hacerla pública.

## Comprobaciones realizadas y controles existentes

- **Sintaxis:** `node --check script.js` terminó correctamente.
- **Lógica aislada:** 12 aserciones correctas: JSON malformado, objeto, `null` y entradas desconocidas; descarte de duplicados y cantidades fuera de rango o no enteras; recuperación del precio desde el catálogo; serialización limitada a identificador/cantidad; 22 identificadores únicos; escape de los cinco caracteres HTML; excepciones de lectura/escritura; vaciado y posterior guardado de estado obsoleto. El primer intento del arnés tuvo un error de comillas propio de la prueba; se corrigió y se ejecutó de nuevo completo. No era un error de `script.js`.
- **Inyección:** `escapeHTML` (`script.js:47`) se usa en valores del formulario y resumen de envío (`117,119`). Las rutas se comparan con valores permitidos (`85-94`); no se insertan como HTML arbitrario. Las plantillas con `innerHTML` también incluyen datos del catálogo fijo: no se confirmó una entrada externa que controle ese catálogo. Si se externaliza, habrá que revisar nuevamente esos puntos.
- **Privacidad y red:** en los cuatro archivos no se identificaron analítica, cookies, llamadas a API, `fetch`, XHR, WebSocket, recursos remotos ni campos bancarios. El formulario intercepta el envío con `preventDefault` (`183`). Los datos de envío permanecen en variables y DOM, se reinician al confirmar o vaciar el carrito y no aparecen en `saveCart`.
- **Simulación:** los controles de ruta impiden pago sin carrito o envío validado y confirmación sin pedido (`92-94`). Confirmar deshabilita el botón, limpia estado y sustituye la ruta (`159-169`). Son controles de flujo del cliente, no autorización de un servidor. Los precios manipulables localmente no son un fraude de pago en este demo sin cobros.
- **Accesibilidad positiva:** idioma español, estructura principal, salto al contenido, región de estado (`index.html:2,13,17,23-24`); campos etiquetados, errores asociados, foco en primer campo inválido (`script.js:117,186-193`); foco al cambiar de vista y tras cambios del carrito (`124,154-158`); foco visible y movimiento reducido (`styles.css:3,8`). Esto verifica implementación, no eficacia con toda tecnología de asistencia.
- **Recursos y rutas:** CSS art y fuentes del sistema; `index.html:9-10` usa rutas relativas. La navegación por fragmentos no exige reescrituras de servidor para cada vista. No se identificó una ruta absoluta de recurso que rompa un sitio de proyecto bajo un subdirectorio.
- **Documentación:** se leyó en UTF-8. Los caracteres extraños de una lectura inicial con la codificación de consola no se reportan como corrupción de archivos. Las pruebas visuales históricas que declara el README no se consideran repetidas en esta revisión.

## Verificación posterior del sitio público en navegador real

Según la comprobación posterior aportada por el usuario, las siguientes pruebas básicas del sitio publicado pasaron:

- URL pública de Pages accesible; Home con 5 accesos y 5 secciones.
- Sin recursos externos cargados durante la comprobación.
- La ruta `#productos/coleccion-shampoos` abre 4 productos y el detalle de shampoo funciona.
- Añadir al carrito funciona; la recarga conserva 1 unidad y eliminarla deja el contador en 0.

Esta verificación complementa la auditoría de código original y no modifica los hallazgos H01–H05. No fue un pentest ni una revisión integral de accesibilidad. Siguen pendientes pruebas más profundas sobre el resto del checkout, accesibilidad asistiva, zoom, caché/CDN y hardening.

## Actualización local del checkout — 5 de octubre de 2026

Esta sección sustituye las pruebas anteriores de teléfonos y territorio; describe la implementación actual. Los hallazgos generales H01–H05 y el estado histórico H06 se conservan. Las referencias numéricas de líneas en la auditoría original son históricas y no corresponden necesariamente al código reorganizado.

El stepper conserva exactamente **Datos de compra/contacto → Pago → Confirmación**. Contacto requiere primer nombre, primer apellido, correo y celular. Segundo nombre, segundo apellido y teléfono fijo son opcionales. El correo valida explícitamente parte local, un @, dominio con punto y ausencia de espacios. El resumen concatena nombres y apellidos, escapando PII. No existen campos o datasets de provincia/cantón ni destino en contacto.

El selector del celular mantiene 245 regiones, nombres españoles/ISO, prefijos compartidos y default EC +593; `countryFlag` genera indicadores regionales Unicode con fallback neutro. Un `span` visible externo al `select` muestra el indicador junto al control y se actualiza al cambiar de país; las opciones también incluyen indicador, nombre y prefijo. La representación gráfica depende de las fuentes y del sistema operativo. Input/paste eliminan todo salvo dígitos. Ecuador exige nueve dígitos empezando en 9; el extranjero se limita a 15 dígitos incluyendo prefijo. Fijo separado con placeholder «02 999 9999», vacío permitido; cuando está presente exige `0[2-7]` + siete dígitos, limpiando espacios/guiones para validar. Dataset offline de libphonenumber-js 1.12.6 conservado, sin instalar librerías ni realizar lookup.

Pago contiene radios nativos en fieldsets: pago y retiro local, o pago en línea. Dentro de online se elige envío a casa (default) o retiro. Únicamente online/home presenta ciudad, dirección, complemento opcional y CP. Al enviar ese modo se exigen ciudad/dirección y CP de seis dígitos, con errores ARIA, mensaje visible y foco en el primer inválido. Los retiros no exigen CP. La ayuda enlaza manualmente al portal oficial con nueva pestaña y noopener; no se infiere CP de la ciudad ni se contrasta entregabilidad. No existen campos de tarjeta.

Cambiar método/entrega actualiza panel, botón, resumen y anuncio accesible sin nuevos pasos; limpia errores conservando borrador en memoria. Cambiar carrito invalida contacto validado y conserva los borradores mientras haya artículos; se revalida el destino al confirmar. La confirmación muestra el fulfillment ficticio, sin PII. `order` guarda solo referencia, artículos y enum de fulfillment. Contacto y dirección se borran al confirmar, recargar o vaciar carrito; localStorage persiste únicamente cart (identificadores/cantidades). Continúan los límites de concurrencia y fallos de persistencia H01–H03.

### Pruebas ejecutadas en esta actualización

`node --check script.js` y `git diff --check` correctos. Chrome 154 headless real con perfil temporal, servidor HTTP local y datos ficticios:

- Tres pasos, EC/Unicode/prefijo, 245 regiones y US/CA separados; nombres requeridos/opcionales y concatenación; correo inválido y sin punto, errores, ARIA, limpieza y foco.
- Celular obligatorio, formatos EC rechazados, nueve dígitos válidos, sanitización input/paste y límites extranjeros; fijo opcional, inválido y válido con separadores.
- Local sin destino; online/home con destino y validación de ciudad/dirección/CP exclusivamente en Pago; CP vacío, cinco/siete dígitos y alfanumérico bloqueados. Enlace oficial y regla visibles.
- Online/pickup sin postal; cambios de selección, botones, limpieza/anuncios y conservación de borrador; confirmaciones para local-pickup, online-home y online-pickup sin PII.
- Protección tras Back y repetición, carrito modificado y contacto revalidado, almacenamiento sin PII, recarga con carrito conservado y borradores vacíos; ninguna excepción JavaScript en el recorrido.
- Viewports reales 390 × 844 y 1237 × 844 sin overflow en contacto y ambos modos de Pago; controles de contacto y etiquetas clicables de radios ≥44 px. Capturas de Pago online/home revisadas visualmente en ambos tamaños, sin roturas observadas.

Las acciones se automatizaron vía CDP; paste se simuló con ClipboardEvent y datos ficticios, sin usar portapapeles del sistema. El indicador de `countryFlag` se muestra en un `span` visible junto al selector, además de figurar en las opciones con nombre y prefijo; su representación gráfica depende de las fuentes y del sistema operativo. No se verificaron lector de pantalla, zoom/contraste, autocompletado real ni compatibilidad extendida. Las medidas táctiles son del checkout y no cierran H04. El alcance permitido de esta versión comprende exactamente cuatro archivos: `script.js`, `styles.css`, `README.md` y `AUDITORIA.md`, sin nuevas dependencias. Esta corrección documental modifica únicamente `README.md` y `AUDITORIA.md`; `index.html` permanece intacto. Los cambios están preparados para publicar; aún no se confirma un nuevo build de GitHub Pages para esta versión. El estado `built` de H06 corresponde a la publicación histórica y no acredita un rebuild de estos cambios.

### Verificaciones manuales observadas

Según las observaciones manuales aportadas para esta versión:

- Pago y retiro local permite confirmar sin destino.
- Pago online con envío a casa bloquea la confirmación con CP inválido y permite confirmar con CP válido de seis dígitos y los demás campos requeridos completos.
- Pago online con retiro permite confirmar sin destino.
- El checkout mantiene exactamente tres pasos: Datos de compra/contacto, Pago y Confirmación.
- El celular es requerido; dejarlo vacío bloquea el avance.
- Estados Unidos +1 aparece con bandera/indicador y prefijo junto al control; las opciones incluyen indicador, nombre y prefijo. El celular extranjero aparece con su +prefijo en el resumen de contacto de Pago.
- La confirmación identifica el `fulfillment` elegido y no revela datos personales (PII).

Estas observaciones corresponden a la simulación: no acreditan verificación real de teléfono, pago o envío real, pruebas con lector de pantalla ni cumplimiento legal certificado.

## Limitaciones

En la auditoría de código original no se ejecutó un navegador, un lector de pantalla ni una herramienta automática de accesibilidad. Las pruebas posteriores en navegador real se limitan a lo registrado en las secciones anteriores: se probaron las reglas actuales de contacto y Pago en Chrome local con datos ficticios. No se realizaron pruebas con transportista, consulta de verificación telefónica (phone lookup), lector de pantalla ni compatibilidad extendida entre navegadores y dispositivos. No se midieron contraste, recortes de foco ni reflujo con zoom. La actualización local midió overflow y altura de controles de contacto y etiquetas de radios en dos anchos, y revisó capturas de Pago; no revisó todos los objetivos táctiles del sitio. Las pruebas registradas no cubren de forma exhaustiva la validación nativa, el autocompletado, el historial completo o la caché de navegación. Los contextos Node de la auditoría original simularon almacenamiento y un DOM mínimo, no un navegador.

La auditoría inicial no accedió a configuración remota de GitHub ni a un sitio publicado; el estado posterior aportado sobre la fuente de Pages, el build, HTTPS y la respuesta del sitio queda registrado en H06. No se añaden comprobaciones de DNS, certificados, cabeceras HTTP ni registros de despliegue más allá del estado de build indicado. No se afirma que falten HTTPS o cabeceras de seguridad. No hay CSP declarada en `index.html`, pero su ausencia no demuestra una explotación; una política restrictiva puede evaluarse como defensa adicional antes de incorporar fuentes externas.

El uso de `autocomplete` en el formulario (`script.js:116-117`) permite asistencia del navegador. Que la aplicación no persista ni transmita esos valores no garantiza el comportamiento del autocompletado, extensiones o equipo. El borrado de variables tampoco es una garantía de borrado forense. Las solicitudes necesarias para servir HTML, CSS y JavaScript y los posibles registros del alojamiento quedan fuera de la afirmación «sin llamadas a API».

No se auditó el resto del directorio, dependencias ajenas al sitio, infraestructura o historial de versiones. No se realizó una búsqueda exhaustiva de secretos ni se incluyeron valores sensibles.

## Recomendaciones de cierre

1. Corregir sincronización y mensajes de fallo de persistencia; probar dos pestañas y fallos de escritura antes de dar por fiable el vaciado.
2. Mejorar aviso móvil, legibilidad e información de persistencia; contrastar las afirmaciones de accesibilidad con medidas reales.
3. Mantener la publicación limitada al conjunto explícito de archivos. Las pruebas básicas del sitio publicado en navegador real sí pasaron, según la verificación posterior descrita arriba. Siguen pendientes pruebas más profundas sobre el resto del checkout, accesibilidad asistiva, zoom, caché/CDN y hardening. Conservar HTTPS enforced, cuyo estado posterior reportado es `true`.
4. Repetir el flujo con datos ficticios en móvil y escritorio, teclado y lector de pantalla. Registrar resultados nuevos por separado de los históricos del README.

Como referencia para H01, [MDN: evento storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) documenta su notificación a otros contextos del mismo origen.

## Integridad de los archivos de entrada

Huellas SHA-256 históricas de la revisión original; no representan las versiones posteriores del formulario, CSS y README:

| Archivo | SHA-256 |
| --- | --- |
| index.html | a307fd78e649a8ede9a32d0ba396123c4eb0ea3f74d630bb5d97c517bac82e85 |
| styles.css | 4f7eeb6aa82a72d5a1a15791fcf1d2f8ed40234c8faadc55f147adbf6d375222 |
| script.js | 9281a5ed374630327679ea341eb3d34bef0f38814b6f9c897c711e2e8fb2ca26 |
| README.md | a386f490154ef65ae3247a2fde991aec3e249eac1e46098dd78e72db26ad982f |