# Prácticas NUDO: ejecución y exposición

Estado al 16 de noviembre de 2026: API, panel y Prisma probados con PostgreSQL local aislado; el proyecto Supabase fue reanudado; se verificaron la lectura de 60 productos, la escritura SQL reversible y el CRUD completo por API con un producto temporal que se eliminó. La nueva versión no se ha publicado. La matriz detalla evidencia y pendientes. La página actual de GitHub Pages tiene `NUDO_API_BASE = ''` y usa la demo.

## Arranque local (PowerShell)

1. `cd C:\EJEMPLOS\PeluqueriaTurnos\backend`
2. `npm.cmd ci`
3. Defina `$env:ADMIN_PASSWORD` con una contraseña propia de al menos 16 caracteres. La variable vive en el proceso; no la escriba en un archivo versionado.
4. Para Supabase, configure `$env:SUPABASE_URL`, `$env:SUPABASE_PUBLISHABLE_KEY` y `$env:SUPABASE_SECRET_KEY` en el entorno del servidor. La URL y clave publicable anteriores se usan por defecto si no se proporcionan. La clave secreta tiene amplios permisos y nunca debe ir en el navegador ni en Git. Use una base/proyecto de prueba para las pruebas de escritura.
5. `npm.cmd start`; abra `http://127.0.0.1:3000/` y `http://127.0.0.1:3000/admin.html`. Para pruebas, `npm.cmd test`.

Si la API falla, la tienda identifica la copia de demostración. El panel autentica, pero no puede listar ni guardar hasta que responda la base. La sesión se mantiene en memoria del navegador, dura una hora y se invalida al cerrar sesión o reiniciar el servidor. Solo existe un administrador configurado por contraseña; no hay cuentas individuales ni roles múltiples. En una publicación real use HTTPS, contraseña fuerte, control de intentos adecuado a la infraestructura y gestión de identidades apropiada. La clave secreta de Supabase elude RLS: manténgala solo en el backend.

## Arranque de la base local de prácticas

Se dejó una copia aislada y detenida en `C:\EJEMPLOS\NUDO-pruebas-postgres`, con 60 productos de demostración y sin registros temporales. Usa autenticación de confianza para el usuario de prueba: es solo para prácticas, debe escuchar únicamente en `127.0.0.1`, y no debe exponerse a Internet. Necesita PostgreSQL 18 instalado en `C:\Program Files\PostgreSQL\18`. En PowerShell:

```powershell
$pgBin = 'C:\Program Files\PostgreSQL\18\bin'
$testDir = 'C:\EJEMPLOS\NUDO-pruebas-postgres'
& "$pgBin\pg_ctl.exe" -D $testDir -l "$testDir\server.log" -o '-p 55439 -h 127.0.0.1' -w start
cd C:\EJEMPLOS\PeluqueriaTurnos\backend
$env:CATALOG_SOURCE = 'postgres'
$env:DATABASE_URL = 'postgresql://nudo_test@127.0.0.1:55439/nudo_test'
$env:ADMIN_PASSWORD = 'Cambiar-por-una-clave-propia'
npm.cmd start
```

Abra `http://127.0.0.1:3000/` y `/admin.html`. Al terminar, detenga el servidor Node con Ctrl+C y ejecute `& "$pgBin\pg_ctl.exe" -D $testDir -m fast -w stop`. La copia local no está sincronizada con Supabase. Para repetir las pruebas reales, con la base arrancada y desde `backend`:

```powershell
$env:NUDO_TEST_DATABASE_URL = 'postgresql://nudo_test@127.0.0.1:55439/nudo_test?schema=public'
$env:LAB_DATABASE_URL = 'postgresql://nudo_test@127.0.0.1:55439/nudo_test?schema=nudo_lab'
npx.cmd prisma generate --schema prisma-lab/schema.prisma
$env:PG_INTEGRATION = '1'
$env:PGHOST = '127.0.0.1'
$env:PGPORT = '55439'
$env:PGUSER = 'nudo_test'
$env:PGDATABASE = 'nudo_test'
$env:SUPABASE_INTEGRATION = '1'
npm.cmd test
```

El 16-11-2026 pasaron las 22 pruebas sin omisiones. Las pruebas específicas solo aceptan la base local `nudo_test`; crean registros temporales con identificadores aleatorios y los borran al terminar. La integración con Supabase en la suite es de lectura; el CRUD remoto se comprobó por separado. La migración de Prisma se aplicó en la base de prueba. En una base nueva, genere primero el cliente y aplique cada migración usando la URL y esquema de prueba correspondientes; no ejecute estas migraciones sobre datos existentes sin revisar la línea base.

## API para probar

- `GET /api/products`: arreglo JSON compatible con el catálogo anterior. También `/api/v1/products`. Permite `?category=Cabello&sort=price&limit=10&offset=0`.
- `GET /api/products/:id`: producto o 404.
- `POST /api/session`: JSON `{"password":"..."}`; devuelve un token temporal. No incluya contraseñas en la URL ni en archivos compartidos.
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`: requieren `Authorization: Bearer <token>` y validación; crear devuelve 201, actualizar 200 y borrar 204. Datos incorrectos 400, sin sesión 401, duplicado 409, base inaccesible 503. `DELETE /api/session` cierra la sesión. Los precios son centavos enteros.
- Las respuestas incluyen `X-Request-Id`. Se permite CORS solo al origen configurado en `FRONTEND_ORIGIN`; OPTIONS responde al preflight. `Content-Type: application/json` es obligatorio para cuerpos JSON. El panel permite crear o editar mediante campos y eliminar previa confirmación; al editar, el identificador queda bloqueado. Los beneficios se escriben uno por línea y las colecciones separadas por comas.

## Prisma y bases

`backend/prisma/schema.prisma` refleja la tabla `products` existente (id, position, data JSONB); `prisma/migrations/202611160001_existing_products` es una línea base para una base vacía. **No ejecute esa migración sobre la tabla existente**: antes de incorporarla a un proyecto real hay que comparar el esquema y decidir cómo registrar la línea base en el historial de Prisma, con respaldo y acceso del propietario. Para una base PostgreSQL de prueba vacía, configure `DATABASE_URL`, ejecute `npx.cmd prisma migrate deploy`, `npx.cmd prisma generate` y `node prisma/consultar.js`. El esquema validó, el cliente se generó, la migración se aplicó a PostgreSQL local aislado y la consulta devolvió productos. La guía original de profundización usa Prisma + SQL Server y modelos relacionados; esta es una adaptación a PostgreSQL, no una ejecución equivalente de ese laboratorio en SQL Server. `backend/prisma-lab` define Categoría y Producto relacionados dentro del esquema aislado `nudo_lab`: su migración y CRUD se ejecutaron con datos de prueba. Una transacción modificó el stock y luego provocó un error de restricción; se comprobó que el stock original se conservó por rollback.

PostgreSQL es SQL: ofrece tablas, restricciones y transacciones ACID; MongoDB es un ejemplo NoSQL orientado a documentos y ofrece otra forma de modelar. Prisma mapea modelos y consultas a SQL y gestiona migraciones; la API de NUDO usa por ahora repositorios `pg` o Data API de Supabase, no Prisma en sus rutas. MySQL y SQL Server son otros motores relacionales. La clave publicable depende de RLS para leer; la clave secreta del backend puede saltar RLS.

## Para exponer

1. **Catálogo:** abra Inicio. El navegador solicita `GET /api/products`; Express llama al servicio y al repositorio, que consulta PostgreSQL/Supabase y devuelve JSON; la vista dibuja tarjetas. Muestre el aviso de fuente. Si hay fallo, muestre que dice «catálogo de demostración», sin afirmar que lee la base.
2. **Carrito:** pulse «Agregar Shampoo suave al carrito» y abra Carrito. `view.js` genera la tarjeta con el producto como entrada; el evento de `script.js` actualiza estado y `cart-repository.js` guarda IDs y cantidades en localStorage. El total se recalcula en `model.js`. El checkout sigue siendo simulado; no registra pedidos ni guarda datos de tarjeta.
3. **Precio:** con una base de prueba conectada, abra `/admin.html`, inicie sesión, seleccione un producto de prueba, cambie «Precio en centavos» y guarde. El PUT pasa por autenticación y validación, el repositorio actualiza la base y, al recargar la tienda, GET presenta el nuevo precio. Restaure o elimine solo el registro de prueba. Se comprobó en la copia local: producto temporal de $12,00 a $17,50, búsqueda en la tienda y eliminación posterior. El CRUD también se comprobó por API contra Supabase real; el panel visual se probó con PostgreSQL local.

Cliente: `frontend/`; servidor y rutas: `backend/src/app.js`; controlador: `backend/src/controllers/product-controller.js`; reglas: `services/product-service.js`; datos: `repositories/` y `database/`. Roles típicos: frontend construye la interfaz, backend implementa API y reglas, especialista de datos cuida esquema y permisos, QA comprueba recorridos, y coordinación/producto define prioridades. Ejemplos: tienda de comercio electrónico, plataforma educativa y banca; cada una conecta clientes, servicios y datos según su necesidad. El PDF de semana 7 falta, así que no se han cotejado sus preguntas.

## Publicación pendiente

1. Supabase ya fue restaurado y conserva 60 productos; RLS está activa con lectura pública. El CRUD de la API se verificó con un producto temporal que se eliminó. Para habilitar escrituras en Render, configurar allí `SUPABASE_SECRET_KEY` solo en el entorno del backend; no pegar la clave en el repositorio ni en el chat.
2. En Render existe el servicio `nudo-botica` conectado a `main`, con URL `https://nudo-botica.onrender.com`. `render.yaml` usa `npm ci --prefix backend` y `npm start --prefix backend`, y declara las credenciales como variables sin valores versionados. Configurar `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` y `ADMIN_PASSWORD` en Render, ademas de `FRONTEND_ORIGIN=https://sotonicolasjnsn.github.io`, `HOST=0.0.0.0` y `CATALOG_SOURCE=supabase`. El codigo local no se ha desplegado; no realices cambios del servicio o despliegues hasta aprobarlos.
3. `frontend/app-config.js` ya dirige el sitio de GitHub Pages a `https://nudo-botica.onrender.com/`. Despues de configurar y desplegar Render, publicar la interfaz en GitHub Pages y comprobar que `GET /api/products` responde 200 con los 60 productos. La publicacion no se ha realizado.
4. Repetir las pruebas de navegador y comprobar que el aviso indica conexión real. Antes de desplegar, revise nuevamente la seguridad y ejecute `npm audit`; la última revisión con Prisma 6.12.0 no reportó vulnerabilidades conocidas.
