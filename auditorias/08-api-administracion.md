# Auditoría 08 — API y administración de productos

**Fecha de referencia:** 16 de noviembre de 2026.

## Objetivo y alcance

Documentar la integración del CRUD, las validaciones y la autenticación administrativa, distinguiendo pruebas simuladas, locales y remotas.

## Componentes y funcionalidades examinados

`backend/src/app.js`, controlador, `product-service.js`, repositorios y panel `frontend/admin.html`/`admin.js`. Se contemplan inicio y cierre de sesión, listado y operaciones HTTP de productos.

## Evidencias concretas

- `57947f1` incorpora el panel, CRUD, pruebas de API y `tests/admin-panel.test.js`.
- `tests/admin-api.test.js` comprueba respuestas de autorización, creación, edición, eliminación, validación y CORS con repositorio en memoria.
- La matriz y el registro de trabajo de 16-11-2026 describen el formulario probado con PostgreSQL local y el CRUD de la API contra Supabase por separado.
- Al probar el panel publicado, una contraseña de 15 caracteres fue rechazada porque el código exigía 16. `538f524` cambió el mínimo a 14; tras desplegarlo se comprobó inicio de sesión y carga del listado.

## Hallazgos y correcciones

La discrepancia entre el mínimo acordado y la implementación impedía el acceso; se corrigió y se verificó en producción. La sesión es temporal y se mantiene en memoria del servidor, por lo que reinicios e instancias independientes afectan su continuidad.

## Resultado y conclusiones

La API y el panel quedaron integrados. La prueba final de escritura en producción se documenta por separado en la auditoría 10; no equivale a una certificación integral de seguridad.
