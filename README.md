# NUDO — Botica contemporánea

## Arquitectura y puesta en marcha

### Supabase

El backend utiliza por defecto el proyecto y la clave **publicable** definidos en `backend/supabase-config.json`. La URL y la clave también pueden establecerse juntas mediante `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`. No coloque claves secretas ni contraseñas en ese archivo. La aplicación consulta la Data API de Supabase desde el repositorio del backend; una clave publicable solo tiene los permisos que conceden PostgreSQL y RLS.

Antes de iniciar con Supabase, revise si ya existe `public.products`. Para un proyecto nuevo, ejecute en el SQL Editor, en este orden, `database/001_schema.sql`, `database/002_seed_catalog.sql` y `database/003_supabase_rls.sql`. El último habilita RLS y permite leer productos a `anon` y `authenticated`; no elimina permisos ni políticas existentes, que deben revisarse por separado. El seed agrega solo identificadores que todavía no existen. Estos scripts no se han aplicado automáticamente al proyecto remoto.

En el proyecto Supabase configurado se verificó la lectura pública de 60 productos el 4 de noviembre de 2026. La lectura comprobada por sí sola no verifica todas las políticas o permisos de escritura: deben revisarse en Supabase.

Como alternativa, `database/supabase_setup.sql` reúne los tres scripts en una sola transacción para pegarlos una vez en el SQL Editor.

Para usar nuevamente PostgreSQL local, establezca `$env:CATALOG_SOURCE='postgres'` antes de arrancar y configure las variables PG que se describen abajo. Reinicie el servidor después de cambiar la configuración. Si Supabase no responde o aún no se ha creado su tabla, la API responde con error y la interfaz conserva provisionalmente el catálogo local de demostración.

La migración a tres capas está en curso. `frontend/` contiene la vista, el controlador de la interfaz y sus repositorios HTTP y de carrito local. `backend/src/` contiene el controlador HTTP, el servicio y el repositorio de productos. `database/` contiene el esquema y los datos iniciales de PostgreSQL. El catálogo se consulta en `GET /api/products`; si la API no responde o no devuelve un catálogo válido, la interfaz utiliza la copia local de demostración.

Requisitos: Node.js 18 o superior y PostgreSQL. Cree una base dedicada y ejecute `database/001_schema.sql` y luego `database/002_seed_catalog.sql` con `psql` o su cliente habitual. El seed conserva los productos que ya existan. Configure `DATABASE_URL` o las variables estándar `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` y `PGPASSWORD` para una cuenta con permiso de lectura sobre `products`.

En esta instalación se creó la base local `nudo` y se cargaron los 60 productos iniciales. Sin `DATABASE_URL` ni `PGDATABASE`, el backend usa `nudo` como nombre de base; el usuario y la contraseña de PostgreSQL deben configurarse mediante las variables de entorno indicadas arriba.

En PowerShell, instale con `cd backend` y `npm.cmd install`, y arranque con `npm.cmd start`. Abra `http://localhost:3000`. El puerto puede cambiarse mediante `PORT`. Para las pruebas ejecute `npm.cmd test` desde `backend`.

El servidor escucha en `127.0.0.1` por defecto. Si el entorno de publicación necesita escuchar en otra interfaz, configure `HOST` explícitamente; para exponerlo a Internet debe utilizar una infraestructura apropiada con HTTPS.

GitHub Pages publica la interfaz estática desde la raíz y redirige a `frontend/`. No ejecuta el backend Node.js: allí se utiliza el catálogo local de demostración y no se consulta Supabase. Para usar Supabase, despliegue el backend en un servicio compatible, configure `HOST=0.0.0.0` y `FRONTEND_ORIGIN=https://sotonicolasjnsn.github.io`, y establezca en `frontend/app-config.js` la URL HTTPS de ese backend. Publique entonces la interfaz actualizada. `FRONTEND_ORIGIN` habilita el acceso solamente para ese origen; sin ella se mantiene el acceso desde el mismo origen.

`render.yaml` prepara un servicio gratuito de Render desde la raíz del repositorio; se requiere conectar el repositorio a una cuenta de Render y crear el servicio. El plan gratuito se suspende después de inactividad y puede tardar en arrancar; el tiempo de espera actual de la interfaz puede hacer que use temporalmente el catálogo local. Consulte las condiciones actuales de Render antes de usarlo para producción.

El carrito, el contacto y el checkout todavía se ejecutan en el navegador: no existe persistencia de pedidos ni pasarela de pago. La copia local del catálogo se mantiene provisionalmente para conservar el funcionamiento sin servidor. Las pantallas que aún están en `frontend/script.js` también están pendientes de extraerse a la vista.

Tienda estática de cuidado capilar y personal en HTML, CSS y JavaScript nativos, con 60 productos, colecciones, detalle, carrito y checkout. Ilustraciones CSS y fuentes del sistema; sin backend, procesador de pagos ni certificación de seguridad o accesibilidad. No existen compras, cobros, correos ni entregas reales.

## Actualización UI/UX — 7 de octubre de 2026

El encabezado incluye iconos SVG locales para Inicio, Productos, Carrito y búsqueda. El cuadro de búsqueda se despliega junto a la lupa, busca nombre, categoría, descripción, etiqueta y beneficios sin distinguir tildes, y permite filtrar por categoría y rango de precio u ordenar por precio, nombre u orden de lista. Los mismos controles están disponibles en el catálogo y en los resultados de búsqueda; sus selecciones se reflejan en la ruta para conservar el estado al navegar. Las fichas muestran productos relacionados por categoría y colección. La portada y el catálogo muestran una fila de productos por categoría, adaptable al ancho de pantalla; «Ver todos» abre la categoría completa y mantiene las otras categorías visibles con su propia fila de productos. El catálogo incluye 60 productos y cinco categorías, entre ellas Rizos y ondas y Cuero cabelludo. Los precios usan el símbolo `$` una sola vez, delante del importe, con mayor jerarquía visual. El carrito confirma antes de quitar un artículo y ofrece vaciar todo. El pie presenta correo, teléfonos y dirección en un diseño adaptable.

La búsqueda queda anclada al botón de lupa, usa un solo icono y se cierra al hacer clic fuera. La cabecera permanece fija al desplazarse. En el resumen, la fila de envío solo aparece al elegir entrega a domicilio; para pagos/retiros se omite. El ticket de pago local no se presenta como ticket de retiro; los tickets de retiro o envío se muestran en el flujo en línea. Cada ticket incluye un código aleatorio de referencia, sin consulta automática ni verificación en servidor.

## Archivos y regla_runtime

- `frontend/index.html`: estructura, navegación, búsqueda e iconos locales; integra `intl-tel-input` 25.12.2 por CDN para selector de país con búsqueda y banderas.
- `model.js`: catálogo y reglas de negocio (búsqueda, precios y validación de tarjeta).
- `cart-repository.js`: lectura y escritura del carrito en `localStorage`.
- `view.js`: componentes de presentación reutilizables.
- `script.js`: controlador de rutas, estado, eventos y pantallas; la extracción de las pantallas a la vista sigue pendiente.
- `styles.css`: presentación adaptable, iconografía SVG local, controles nativos y bandera/prefijo separados.
- `README.md` y `AUDITORIA.md`: uso, alcance, evidencias y limitaciones.

El historial de auditoría de la publicación en el commit `70597e0` se conserva como referencia documental. **Recursos externos en runtime:** `intl-tel-input` 25.12.2 (JavaScript, CSS y sprites de banderas) se carga desde jsDelivr; si el CDN no está disponible, queda el selector nativo de países con fallback de bandera. También se conserva el fallback de imagen de bandera desde FlagCDN. No hay analítica, API de pago ni consultas automáticas de teléfonos o direcciones. El enlace de ayuda al portal de código postal se abre solo por acción del usuario.

La demo también puede abrirse desde `frontend/index.html` sin servidor, utilizando el catálogo local. Las banderas gráficas necesitan conexión; si fallan, se muestra `countryFlag` Unicode o un símbolo global. La búsqueda y los filtros de categoría, precio y orden se ejecutan en el navegador y se actualizan al cambiar cada control; las tarjetas permiten agregar al carrito sin salir del catálogo. En el carrito, los controles de cantidad se desactivan en los límites y muestran ese estado visualmente. Rutas principales: `#inicio`, `#productos`, `#buscar/shampoo`, `#detalle/shampoo`, `#carrito`, `#envio`, `#pago`, `#confirmacion`; los criterios activos se guardan como parámetros de la ruta.

## Tres pasos exactos

1. **Datos de compra/contacto:** nombre, apellido, correo y celular obligatorios. Ecuador limita el celular a nueve dígitos y bloquea el cero inicial porque el prefijo `+593` ya está seleccionado. No hay dirección ni CP en este paso.
2. **Pago:** permite elegir pago en el local o pago en línea. El pago en el local crea un ticket de pago pendiente. La opción en línea valida los campos y presenta el pago como confirmado, con entrega a casa (predeterminada) o retiro. Es una presentación estática: no hay procesador ni cobro real.
3. **Confirmación:** el pago pendiente genera un ticket de pago; la opción en línea genera ticket de retiro o envío según la entrega. Todos incluyen un código aleatorio de referencia y muestran nombre, apellido, correo y celular del comprador. El ticket de domicilio también muestra la dirección ingresada, sin controles para editarla.

| Fulfillment | Ticket/estado | Envío simulado |
| --- | --- | --- |
| `local-pickup` | Ticket de pago pendiente; retiro previsto en 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-pickup` | Pago presentado como confirmado; ticket de retiro en 12 de Octubre y Veintimilla | $0; «No aplica» |
| `online-home` | Pago presentado como confirmado; ticket de envío a casa | Fijo $5,00 |

Solo online/home muestra Ciudad, Dirección, Complemento opcional y CP. En su submit se recortan espacios exteriores y se exige CP de exactamente seis dígitos; nunca se trunca ni se infiere de la ciudad. Ciudad/dirección son obligatorias. Los retiros no muestran ni validan destino. Una sola función `deliveryFee` define el cargo: 500 centavos exclusivamente para online/home. El pedido guarda `deliveryFee` numérico en centavos, `fulfillment`, modalidad de pago, código de referencia y artículos. El código sirve para identificar visualmente el ticket; sin backend no se puede verificar en otro dispositivo.

## Formato de pago

Los campos de tarjeta se muestran únicamente al elegir pago en línea. El número debe tener de 12 a 19 dígitos y superar la validación del número; también admite espacios o guiones como separadores. Si no es válido, se muestra un mensaje breve y genérico. El vencimiento requiere mes `01`–`12` y año de dos dígitos. Al escribir o pegar, no se aceptan meses fuera de ese rango. El CVV admite 3 o 4 dígitos. No se comprueba una tarjeta fija, no se verifica el titular ni se conecta a un procesador.

El número de tarjeta se agrupa visualmente cada cuatro dígitos. Los valores de tarjeta no se copian al objeto `payment`, el pedido, el almacenamiento ni las solicitudes; cambiar de modalidad reconstruye los inputs y confirmar elimina la pantalla de pago. Los errores aparecen mientras se escribe, al salir del campo y al enviar, asociados mediante `aria-describedby` y `aria-invalid`; el envío enfoca el primer campo inválido. La entrega a casa valida ciudad, dirección y código postal mientras se completan. El destino se escapa al reconstruir inputs y las alertas usan texto.

## Celular y país

`intl-tel-input` 25.12.2 en JavaScript nativo proporciona selector con búsqueda por país o prefijo y muestra las banderas tanto en la opción seleccionada como en los resultados. Ecuador es el valor predeterminado; admite como máximo nueve dígitos nacionales, bloquea un cero inicial y exige nueve iniciando en 9 para continuar. En otros países se permite hasta 15 dígitos contando el prefijo, ajustados al país seleccionado. Si no carga el CDN, sigue disponible el selector nativo de países con bandera de fallback.

Se conservan los metadatos locales de libphonenumber-js 1.12.6, sin instalar su librería. Celular: dígitos solamente; Ecuador limita la entrada a nueve dígitos y exige nueve empezando en 9, sin cero inicial; internacional admite hasta 15 contando prefijo. Estas reglas no comprueban existencia o titularidad. Nombres admiten letras Unicode, espacios, guiones y apóstrofes, con al menos dos letras; correo requiere usuario, @ y dominio con punto.

## Persistencia y privacidad

Solo `localStorage['nudo-cart-v1']` guarda cart: identificadores y cantidades. No se escriben cookies ni sessionStorage. Contacto/destino viven en memoria y DOM hasta confirmar, recargar o vaciar el carrito; el ticket de confirmación muestra los datos de contacto ingresados durante el pedido. `emptyPayment` contiene exclusivamente method, delivery y destination; `editPayment` nunca guarda tarjeta. La información no se envía a un servidor y se elimina al recargar.

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
