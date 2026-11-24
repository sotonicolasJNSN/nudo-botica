# Práctica NUDO Botica: Prisma, migraciones y CI/CD

## Alcance comprobado

La aplicación usa una arquitectura por capas: interfaz → API Express → controlador → servicio → repositorio → PostgreSQL. El repositorio Prisma se selecciona con `CATALOG_SOURCE=prisma` y mantiene las operaciones y rutas del catálogo. La base de producción no se modificó para esta práctica.

La demostración local usa PostgreSQL 18 en `127.0.0.1:55479`, base aislada `nudo_test`, y el servidor Node en `http://127.0.0.1:3008`. Se copiaron a la base de prueba los 60 productos del catálogo; no se trata de una conexión a Supabase. Estos servicios están activos durante la sesión actual y podrían detenerse al reiniciar el equipo.

## Versiones

- Node.js 22 en GitHub Actions y Render; mínimo del proyecto 18.18.
- Prisma y Prisma Client 6.12.0; Express 5.3.0; pg 8.23.1, según `backend/package-lock.json`.
- PostgreSQL de prueba local: 18.0.

## Ejecutar y demostrar

1. Abrir `http://127.0.0.1:3008/` para la tienda y `http://127.0.0.1:3008/api/products` para ver el catálogo consultado mediante Prisma.
2. Revisar `backend/prisma/schema.prisma`: el modelo `Product` corresponde a la tabla `products` y conserva `id`, `position` y `data` JSON.
3. Revisar `backend/prisma/migrations/202611160001_existing_products/migration.sql`. La migración se aplicó a una base de prueba vacía; **no debe ejecutarse sobre la tabla existente de producción**.
4. Revisar `backend/src/repositories/prisma-product-repository.js` y `catalog-provider.js` para explicar el patrón repositorio y la selección de Prisma.
5. Revisar `.github/workflows/ci.yml` y [la ejecución de CI aprobada](https://github.com/sotonicolasJNSN/nudo-botica/actions/runs/45320686509). El workflow instala dependencias, valida los esquemas, genera los clientes, aplica las migraciones a PostgreSQL temporal y ejecuta pruebas.
6. El panel está disponible en `http://127.0.0.1:3008/admin.html`; el servidor de demostración no tiene contraseña administrativa configurada. La contraseña administrativa debe elegirla el usuario antes de habilitar inicio de sesión en esa copia.

## Evidencias

- API local con Prisma: HTTP 200, 60 productos y 60 identificadores únicos.
- Pruebas de integración locales: 5 aprobadas, 0 fallidas; incluyen API administrativa con repositorio Prisma, CRUD, migraciones de laboratorio y rollback transaccional en PostgreSQL de prueba. Los productos temporales se eliminan al concluir la prueba.
- GitHub Actions: 30 pruebas, 27 aprobadas, 0 fallidas y 3 integraciones externas omitidas. La base usada en CI es efímera y no usa las credenciales de Supabase.
- Render está configurado para desplegar cambios de `main` después de las comprobaciones de CI. Se verificó un despliegue exitoso de la revisión `3bdc039`.
- Supabase se reanudó y la API publicada devolvió 60 identificadores que coincidían con el catálogo. Render se configuró con `CATALOG_SOURCE=prisma` y una conexión PostgreSQL privada al pool de sesiones de Supabase. La API publicada con Prisma respondió HTTP 200 con 60 productos.

## Límites y precauciones

Prisma consultó la base de producción en modo de solo lectura; el CRUD se comprobó con productos temporales exclusivamente en la base aislada. No se aplicaron migraciones ni escrituras a la base de producción. No ejecutar seeds, reset ni migraciones en Supabase existente sin revisar la línea base y el respaldo. No guardar contraseñas o claves en el código ni en GitHub.
