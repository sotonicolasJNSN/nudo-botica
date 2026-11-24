# NUDO Botica

Aplicación de catálogo y administración de productos de una botica. El proyecto combina un frontend estático, una API en Node.js y una base de datos PostgreSQL alojada en Supabase. La práctica incorpora Prisma, migraciones, pruebas automatizadas y un flujo de integración y despliegue continuo.

## Enlaces principales

| Recurso | Enlace | Uso |
| --- | --- | --- |
| Repositorio | [github.com/sotonicolasJNSN/nudo-botica](https://github.com/sotonicolasJNSN/nudo-botica) | Código, documentación e historial. |
| Tienda | [NUDO Botica en GitHub Pages](https://sotonicolasjnsn.github.io/nudo-botica/) | Interfaz pública. |
| Panel administrativo | [Panel de administración](https://sotonicolasjnsn.github.io/nudo-botica/frontend/admin.html) | Gestión de productos; requiere contraseña y sesión. |
| Backend | [Servicio en Render](https://nudo-botica.onrender.com/) | Servidor Node.js de la aplicación. |
| API de catálogo | [GET /api/products](https://nudo-botica.onrender.com/api/products) | Catálogo público en JSON. |
| API versionada | [GET /api/v1/products](https://nudo-botica.onrender.com/api/v1/products) | Las mismas operaciones bajo la ruta versionada. |
| Integración continua | [GitHub Actions](https://github.com/sotonicolasJNSN/nudo-botica/actions) | Ejecuciones de pruebas y publicación de Pages. |
| Configuración de Render | [render.yaml](render.yaml) | Comandos, versión y variables del servicio. |
| Plataforma de datos | [Supabase](https://supabase.com/dashboard) | Administración del proyecto PostgreSQL; requiere acceso autorizado. |

El servicio de Render puede tardar en responder después de un periodo de inactividad. Las credenciales, la URL privada de PostgreSQL y los tokens no se publican en este repositorio.

## Arquitectura

```text
Navegador: tienda / panel administrativo
                  │ HTTPS / JSON
                  ▼
          API Node.js + Express (Render)
                  │
          Rutas → Controlador → Servicio → Repositorio
                                              │
                         Prisma / pg / Data API de Supabase
                                              │
                               PostgreSQL en Supabase
```

El frontend publicado en GitHub Pages consulta al backend; `frontend/app-config.js` define la dirección de la API. El servidor recibe la petición, el **controlador** prepara la respuesta HTTP, el **servicio** aplica validaciones y el **repositorio** realiza el acceso a datos. Esta separación por capas y el patrón repositorio permiten cambiar el mecanismo de persistencia sin cambiar las rutas públicas.

Con `CATALOG_SOURCE=prisma`, el repositorio utiliza Prisma Client para consultar PostgreSQL. También hay proveedores alternativos: `postgres`, con la biblioteca `pg`, y `supabase`, mediante la Data API. **Supabase es la plataforma donde se aloja PostgreSQL; Prisma es la herramienta de acceso**, no otra base de datos. La configuración versionada de Render selecciona Prisma.

La tabla `products` contiene `id`, `position` y `data` (JSONB). El modelo `Product` se asigna a esta tabla existente mediante `@@map("products")`. El checkout no procesa pagos ni guarda datos personales; al confirmar, la API registra una referencia idempotente y descuenta el inventario.

## Estructura del repositorio

| Ubicación | Contenido |
| --- | --- |
| [`frontend/`](frontend/) | Tienda, panel administrativo, configuración de la API y recursos estáticos. |
| [`backend/src/app.js`](backend/src/app.js) | Rutas HTTP, sesiones, CORS y manejo de errores. |
| [`backend/src/server.js`](backend/src/server.js) | Inicio del servidor y selección del proveedor. |
| [`backend/src/controllers/`](backend/src/controllers/) | Controlador de productos y respuestas HTTP. |
| [`backend/src/services/`](backend/src/services/) | Operaciones y validaciones del catálogo. |
| [`backend/src/repositories/`](backend/src/repositories/) | Selector de proveedor e implementaciones Prisma, PostgreSQL y Supabase. |
| [`backend/prisma/`](backend/prisma/) | Esquema Prisma del catálogo y migración inicial. |
| [`backend/prisma-lab/`](backend/prisma-lab/) | Esquema y migraciones del laboratorio aislado de Prisma. |
| [`database/`](database/) | Scripts SQL de esquema, catálogo inicial, políticas RLS e inventario. |
| [`tests/`](tests/) | Pruebas automatizadas de API, administración, proveedores y laboratorio. |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Validaciones, pruebas y despliegue manual opcional. |
| [`auditorias/`](auditorias/) | Auditorías históricas; su fecha determina el estado que describen. |

## API HTTP

**URL base:** `https://nudo-botica.onrender.com`. Las rutas `/api/products` y `/api/v1/products` admiten las mismas operaciones de productos. Los enlaces GET se pueden abrir en el navegador; POST, PUT y DELETE se invocan con un cliente HTTP y requieren sesión administrativa.

| Método | Ruta | Función | Acceso |
| --- | --- | --- | --- |
| GET | [`/api/products`](https://nudo-botica.onrender.com/api/products) | Lista los productos. | Público |
| GET | `/api/products/:id` | Consulta un producto por identificador. | Público |
| POST | `/api/orders` | Valida y descuenta inventario de forma atómica e idempotente. | Público |
| POST | `/api/session` | Inicia sesión con `{"username":"…","password":"…"}` y devuelve un token temporal. | Usuario y contraseña |
| DELETE | `/api/session` | Cierra la sesión. | Token |
| POST | `/api/products` | Crea un producto. | Token |
| PUT | `/api/products/:id` | Actualiza un producto completo. | Token |
| DELETE | `/api/products/:id` | Elimina un producto. | Token |
| GET / POST | `/api/suppliers` | Consulta o crea proveedores comerciales. | Token |
| DELETE | `/api/suppliers/:id` | Elimina un proveedor sin productos asignados. | Token |
| GET | `/api/product-suppliers` | Consulta las relaciones entre productos y proveedores. | Token |
| POST / PUT | `/api/admin/products` / `/api/admin/products/:id` | Guarda un producto y su proveedor en una transacción. | Token |

Las operaciones protegidas requieren `Authorization: Bearer <token>`. La sesión dura una hora y se guarda en memoria del servidor, por lo que puede perderse si este se reinicia. El acceso con usuario requiere crear la tabla `admin_users` y cargar las cuentas autorizadas; las contraseñas se almacenan como hashes con scrypt y sal, no en texto plano. Hasta completar ese paso, se conserva el acceso anterior por contraseña dejando el campo de usuario vacío. Los cuerpos JSON utilizan `Content-Type: application/json`. No incluya contraseñas o tokens en URL, capturas públicas o archivos del repositorio.

### Flujo de productos

1. **Consulta:** la tienda solicita `GET /api/products` al servidor de Render.
2. **Procesamiento:** la ruta envía la solicitud al controlador y este llama al servicio.
3. **Datos:** el servicio utiliza el repositorio Prisma; Prisma consulta la tabla `products` de PostgreSQL en Supabase.
4. **Respuesta:** los productos vuelven como JSON a la tienda, que los muestra en el catálogo.
5. **Administración:** una persona inicia sesión y recibe un token. El panel envía ese token junto con la solicitud de crear, modificar o eliminar; el servidor comprueba la sesión y valida los datos antes de ejecutar la operación. La tienda refleja los cambios cuando vuelve a consultar el catálogo.

Las escrituras se prueban con registros temporales en una base aislada; la base de producción contiene el catálogo real. El panel permite crear proveedores comerciales y elegir uno para cada producto. La relación se guarda en `product_suppliers` sin alterar la estructura de `products`; los proveedores iniciales identificados como ficticios son ejemplos, no empresas verificadas.

Para crear un producto en el panel, seleccione su proveedor y categoría, complete los datos y escriba el precio en dólares. El identificador se genera automáticamente y el backend conserva el precio en centavos. Los productos anteriores mantienen su categoría, identificador y campos visuales al editarlos. No se puede eliminar un proveedor mientras tenga productos asignados; primero hay que reasignarlos.

El listado acepta `category`, `sort=price`, `limit` y `offset`. Por ejemplo: [consultar cinco productos ordenados por precio](https://nudo-botica.onrender.com/api/products?sort=price&limit=5&offset=0). El límite debe estar entre 1 y 100 y el desplazamiento ser un entero no negativo.

Para crear o actualizar, el producto incluye `id`, `name`, `category`, `description`, `label`, `size`, `art`, `price`, `stock`, `benefits` y `collections`. El precio se expresa como **centavos enteros**; `stock` es una cantidad entera no negativa y los campos `benefits` y `collections` son arreglos de texto. En una actualización el `id` del cuerpo debe coincidir con el de la ruta. El servidor valida el contenido antes de usar el repositorio.

El carrito limita cada cantidad a las existencias disponibles. Al confirmar, `POST /api/orders` envía solo una referencia y los identificadores/cantidades; el servidor vuelve a validar el inventario y realiza el descuento en una transacción. Reintentar la misma referencia y los mismos artículos no duplica el descuento. No se guardan datos personales ni se procesa el pago.

Respuestas habituales: `200` consulta o actualización; `201` creación; `204` eliminación o cierre de sesión; `400` datos inválidos; `401` sesión ausente o vencida; `404` registro o ruta inexistente; `409` producto duplicado; `429` demasiados intentos de inicio de sesión; `503` fallo de acceso al catálogo. Estos códigos dependen del caso y del proveedor. El servidor agrega `X-Request-Id` para facilitar el diagnóstico.

## Versiones y configuración

| Componente | Versión o configuración |
| --- | --- |
| Node.js | 22 en CI y Render; mínimo declarado: 18.18. |
| Express | `^5.3.0` en `package.json`. |
| PostgreSQL | Servicio PostgreSQL de Supabase; CI utiliza la imagen `postgres:18`. |
| `pg` | `^8.13.1` en `package.json`. |
| Prisma y `@prisma/client` | `6.12.0`. |
| Dependencias exactas | [`backend/package-lock.json`](backend/package-lock.json). |

Las variables de entorno se definen fuera del código. Las principales son `CATALOG_SOURCE`, `DATABASE_URL`, `ADMIN_PASSWORD`, `FRONTEND_ORIGIN`, `HOST` y `PORT`. Si se utiliza el proveedor Supabase Data API también se configuran `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`; para sus escrituras administrativas se requiere `SUPABASE_SECRET_KEY`. La contraseña administrativa debe tener al menos 14 caracteres. `DATABASE_URL`, `ADMIN_PASSWORD` y las claves secretas son privadas: no deben incluirse en GitHub.

## Ejecución local

Se necesita Node.js y una base PostgreSQL **de prueba** compatible. Configure en el entorno `DATABASE_URL` para esa base, `CATALOG_SOURCE=prisma` y, si necesita probar administración, `ADMIN_PASSWORD` con una contraseña elegida por usted. No copie credenciales de producción ni utilice productos reales para pruebas de escritura.

```bash
cd backend
npm ci
npm run prisma:validate
npm run prisma:generate
npm start
```

El servidor escucha por defecto en `http://127.0.0.1:3000`. Para ejecutar la suite use `npm test` desde `backend`. En Windows se puede utilizar `npm.cmd` si PowerShell bloquea los scripts de npm. Las pruebas de integración requieren configuración y bases de prueba adicionales; algunas se omiten si faltan sus variables. Consulte [`backend/package.json`](backend/package.json) y [el flujo de CI](.github/workflows/ci.yml) para conocer los comandos exactos.

## Migraciones y SQL

[`backend/prisma/migrations/202611160001_existing_products/`](backend/prisma/migrations/202611160001_existing_products/) contiene una migración inicial para crear `products` en una **base vacía**. CI la aplica a PostgreSQL temporal. No debe aplicarse directamente a la tabla existente de Supabase sin revisar su estado, respaldo y estrategia de línea base, y sin autorización específica. No use `prisma migrate reset` ni `prisma db push` sobre producción.

Las migraciones posteriores describen las tablas `admin_users`, `suppliers` y `product_suppliers`. La asignación de los proveedores ficticios al catálogo existente es una carga de datos separada de la creación de la estructura. Antes de aplicar cambios en una base existente, revise qué tablas ya existen; no ejecute la migración inicial de `products` sobre una tabla existente.

El laboratorio [`backend/prisma-lab/`](backend/prisma-lab/) es independiente y utiliza `LAB_DATABASE_URL` y datos de prueba. Los scripts de [`database/`](database/) son recursos SQL independientes; no los ejecute en una base existente sin revisar el estado, respaldo y autorización. `database/004_inventory.sql` crea la función transaccional e idempotente que requiere `POST /api/orders`; debe aplicarse una vez en la base conectada antes de habilitar pedidos. Los productos antiguos sin `stock` se consideran en cero: cargue existencias reales desde el panel antes de vender. Esta migración no se ha aplicado automáticamente a Supabase de producción. CI no ejecuta migraciones en Supabase de producción.

## Pruebas y CI/CD

El flujo [GitHub Actions](.github/workflows/ci.yml) instala dependencias con `npm ci`, valida y genera los dos clientes Prisma, levanta PostgreSQL temporal, aplica las migraciones en prueba y ejecuta `npm test`. Consulte los resultados reales en [Actions](https://github.com/sotonicolasJNSN/nudo-botica/actions); una prueba omitida no cuenta como aprobada.

La configuración [`render.yaml`](render.yaml) indica Node 22, genera Prisma durante el build y usa `autoDeployTrigger: checksPass`: Render puede desplegar cambios de la rama conectada después de que pasen las comprobaciones de CI. El workflow también define un despliegue manual opcional mediante un secreto y el entorno `production`; su disponibilidad depende de la configuración de GitHub. Los despliegues y cambios de datos reales requieren autorización específica. Confirme siempre el estado final en Render y con una consulta a la API.

## Documentación y evidencia

- [Práctica Prisma y CI](PRACTICA_PRISMA_CI.md): procedimiento, decisiones y evidencias de la práctica.
- [Auditorías del proyecto](auditorias/): revisiones por tema, incluida la arquitectura y el backend.
- [Matriz de prácticas](MATRIZ_PRACTICAS_NUDO.md) y [guía de prácticas](GUIA_PRACTICAS_NUDO.md): documentos históricos que pueden describir un estado anterior; prevalecen el código y la configuración actuales.
- [Ejecución de CI del commit de activación de Prisma](https://github.com/sotonicolasJNSN/nudo-botica/actions/runs/45328377223): ejecución registrada como satisfactoria.

En la comprobación de lectura realizada el 24 de noviembre de 2026, `GET /api/products` respondió `200` y devolvió 60 productos. Esta observación es puntual: no prueba por sí sola las escrituras ni garantiza la disponibilidad futura. Las operaciones de escritura deben verificarse en un entorno aislado; el uso de producción requiere autorización específica.
