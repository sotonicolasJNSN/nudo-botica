# Auditoría 1 — NUDO después de la migración inicial

Fecha: 4 de noviembre de 2026. Esta revisión complementa `AUDITORIA.md`, que se conserva sin cambios. Evalúa el estado local del código, la API y la base `nudo`; no es una certificación de seguridad ni una evaluación de un despliegue público.

## Alcance y arquitectura

- `frontend/`: interfaz, controlador, componentes, catálogo local y carrito en `localStorage`.
- `backend/src/`: servidor HTTP, controlador, servicio y repositorio de productos.
- `database/`: esquema y catálogo inicial para PostgreSQL.
- La API expone el catálogo por `GET /api/products`. La creación de pedidos, los pagos y el contacto siguen en el navegador y no se guardan en la base de datos.

## Hallazgos

### Alta — El formulario de demostración solicita datos de tarjeta

`frontend/script.js:169` crea campos de número de tarjeta, vencimiento y CVV. El flujo es una simulación y el código no los incluye en el objeto del pedido, pero una persona podría ingresar datos reales. Antes de una publicación pública es necesario sustituir estos campos por una integración real con un proveedor de pagos o por una demostración que no solicite datos sensibles.

### Alta — Contenido del catálogo insertado como HTML

El catálogo proviene de PostgreSQL y `frontend/script.js:397` y `frontend/view.js` interpolan propiedades de productos en plantillas HTML. Si alguien pudiera modificar el contenido de la tabla e insertar marcado malicioso, podría ejecutarse código en el navegador. Escapar cada valor en el contexto apropiado y restringir los permisos de escritura en la base son medidas necesarias antes de gestionar contenido externo.

### Media — La interfaz puede mostrar un catálogo desactualizado sin avisar

`frontend/catalog-repository.js:5` conserva la copia local si la API falla, devuelve datos inválidos o tarda más de tres segundos. Esto mantiene la demo disponible, pero puede mostrar precios distintos a los de PostgreSQL sin informar al usuario. Conviene mostrar el estado y evitar tomar decisiones comerciales con datos de respaldo.

### Media — El checkout no registra pedidos ni procesa pagos

`frontend/script.js:657` construye el pedido en memoria; al recargar se pierde. El backend solo consulta productos. Se requieren persistencia transaccional, validación de precios en servidor, inventario y un proveedor de pagos antes de usarlo para ventas reales.

### Media — Controles de producción pendientes

El servidor de `backend/src/app.js` sirve archivos y la API, pero no configura por sí mismo HTTPS, límites de solicitudes ni una política de seguridad de contenido. El despliegue público requiere configurarlos en la infraestructura y revisar los orígenes externos permitidos. La aplicación usa un CDN para el selector telefónico.

### Media — MVC y tres capas aún incompletos

La separación inicial existe, pero `frontend/script.js` todavía combina navegación, estado, eventos y plantillas de pantallas. El catálogo se guarda como JSONB y la validación de su estructura es limitada. Continuar extrayendo vistas y reglas, y definir un contrato de datos validado para productos.

### Baja — Carrito compartido entre pestañas

El carrito usa `localStorage` mediante `frontend/cart-repository.js`; distintas pestañas pueden sobrescribir cambios. Sincronizar y resolver conflictos si se requiere que varias pestañas trabajen simultáneamente.

## Verificación realizada

- PostgreSQL local: base `nudo`, 60 productos y 60 identificadores distintos.
- `node --test tests/*.test.js`, con integración a PostgreSQL habilitada: 8 pruebas aprobadas, 0 fallidas.
- La API se verificó mediante las pruebas HTTP y consulta a la base real.
- Despliegue local: la portada respondió con HTTP 200 y `/api/products` devolvió 60 productos desde PostgreSQL.
- No se realizó en esta revisión una prueba visual completa del navegador, una prueba de carga ni una auditoría automatizada de dependencias. Los resultados no demuestran que un entorno público esté configurado correctamente.

## Prioridades recomendadas

1. Retirar la captura simulada de datos de tarjeta y definir el alcance real del checkout.
2. Escapar y validar los datos del catálogo antes de presentarlos.
3. Implementar pedidos y validaciones comerciales en el servidor si se habilitan ventas reales.
4. Configurar HTTPS, controles de seguridad y observabilidad en el entorno de publicación.
5. Continuar la separación de pantallas y completar pruebas de navegador.
