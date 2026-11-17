# Matriz de prácticas NUDO

Corte: 16-11-2026. «Verificado» indica solo el alcance descrito en la prueba, no una verificación de producción. Estado inicial: repositorio limpio en `bb83233`, igual a `origin/main`; 11 pruebas correctas y 2 integraciones omitidas. Semana 7 no fue adjuntada. Las guías enlazan los archivos ausentes `clase8-ejercicio-evaluado.html` y `clase9-ejercicio-evaluado.html`; por tanto sus preguntas específicas no se pueden cotejar. Las páginas de PDF corresponden a páginas físicas. Las fuentes se usan como material académico, no como instrucciones operativas.

| ID | Fuente y página | Qué pide | Tipo | Estado inicial | Cambio o demostración en NUDO | Archivo o ruta | Prueba concreta | Resultado final |
|---|---|---|---|---|---|---|---|---|
| 7-01 | Semana 7, ausente | Cliente, servidor, datos, servicios | explicación conceptual | parcial | Mapa de archivos | GUIA, Para exponer | Inspección de archivos | verificado |
| 7-02 | Semana 7, ausente | Roles y ejemplos de plataformas | explicación conceptual | pendiente | Roles y tres ejemplos | GUIA | Lectura de explicación; falta cotejar PDF | parcial |
| 7-03 | Semana 7, ausente | Preguntas de evaluación | requisito explícito | bloqueado | Obtener material | PDF semana 7 | No recibido | bloqueado |
| 8-01 | Semana 8 pp. 1–5 | Presentación, negocio, datos | práctica aplicada | parcial | Vista, servicio, repositorios | frontend; backend/src | Inspección de código | verificado |
| 8-02 | Semana 8 pp. 6–10 | Métodos HTTP | práctica aplicada | parcial | GET, POST, PUT, DELETE, OPTIONS | app.js | admin-api.test.js | verificado en memoria |
| 8-03 | Semana 8 pp. 6–10 | Cabeceras y códigos | práctica aplicada | parcial | JSON, CORS, ID, 200/201/204/400/401/404/409/503 | app.js | npm test | verificado en memoria |
| 8-04 | Semana 8 pp. 11–17 | Cliente-servidor, HTTPS y JSON | explicación conceptual | parcial | Flujo y seguridad | GUIA | Revisión de explicación | verificado |
| 8-05 | Semana 8 pp. 17–24 | Configurar y arrancar Node | práctica aplicada | existente sin verificar | npm ci / npm start | backend | npm start sirvió localhost:3000 | verificado |
| 8-06 | Semana 8 pp. 24–34 | Recorrido completo navegador → API → BD → navegador | práctica aplicada | parcial | Flujo contra PostgreSQL local; repositorio Supabase | app.js; catalog-repository.js | navegador localhost:3003 → API → Supabase → 60 productos; carrito $12,50 | verificado con Supabase |
| 8-Q1 | Semana 8 p. 36 | Ciclo petición/respuesta | explicación conceptual | pendiente | GUIA, catálogo | GUIA | Navegador y código | verificado salvo base remota |
| 8-Q2 | Semana 8 p. 36 | Función express.json | explicación conceptual | pendiente | Interpreta JSON del cuerpo | app.js | POST de prueba | verificado |
| 8-Q3 | Semana 8 p. 37 | Ventaja HTTPS | explicación conceptual | pendiente | Cifra y protege datos en tránsito | GUIA | Explicación; Pages HTTPS | verificado conceptual |
| 8-Q4 | Semana 8 p. 37 | Estructura modular | explicación conceptual | parcial | Separar presentación, lógica y datos | GUIA | Inspección | verificado |
| 8-G1 | Guía 8 pasos 2–6 | Mantenimiento, estados, stateless, handler y preflight | explicación conceptual | pendiente | Véanse notas bajo esta tabla | GUIA y app.js | Inspección y OPTIONS en test | verificado |
| 8-E | Guía 8, ejercicio enlazado | Ejercicio evaluado externo | requisito explícito | bloqueado | Archivo no adjunto | clase8-ejercicio-evaluado.html | No encontrado | bloqueado |
| 9-01 | Semana 9 pp. 1–8 | Node, event loop y Express | explicación conceptual | parcial | API Express y explicación | app.js; notas | npm start / npm test | verificado |
| 9-02 | Semana 9 pp. 8–15 | Rutas, controladores, servicio y repositorio | práctica aplicada | parcial | Rutas Express llaman servicio y repositorio | app.js; services; repositories | admin-api.test.js | verificado con repositorio simulado |
| 9-03 | Semana 9 pp. 16–23 | Listar | requisito explícito | existente sin verificar | GET products | API | admin-api.test.js | verificado en memoria |
| 9-04 | Semana 9 pp. 16–23 | Consultar por ID | requisito explícito | pendiente | GET products/:id | API | 200 y 404 en test | verificado en memoria |
| 9-05 | Semana 9 pp. 16–23 | Crear | requisito explícito | pendiente | POST products | API; admin.html | 201 en PostgreSQL y en API real con Supabase | verificado local y Supabase |
| 9-06 | Semana 9 pp. 16–23 | Editar | requisito explícito | pendiente | PUT products/:id | API; admin.html | cambio de 1200 → 1750 en PostgreSQL y API Supabase | verificado local y Supabase |
| 9-07 | Semana 9 pp. 16–23 | Eliminar | requisito explícito | pendiente | DELETE products/:id | API; admin.html | 204 y posterior 404 por API Supabase; eliminación en navegador local | verificado local y Supabase |
| 9-08 | Semana 9 pp. 22, 29 | Validación servidor | requisito explícito | pendiente | ID, campos y precio en centavos | product-service.js | Precio negativo → 400 | verificado |
| 9-09 | Semana 9 pp. 24–31 | Middleware, errores, ID y registro | requisito explícito | parcial | express.json, CORS, ID, error central | app.js | ID, 503 y JSON en tests | verificado |
| 9-10 | Semana 9 pp. 33–36 | Versionado y respuestas | práctica aplicada | pendiente | /api/v1 y ruta compatible; códigos | app.js | GET versionado en test | verificado |
| 9-11 | Semana 9 p. 36 | Filtro | práctica aplicada | pendiente | category | API | admin-api.test.js | verificado en memoria |
| 9-12 | Semana 9 p. 36 | Paginación | práctica aplicada | pendiente | limit y offset | API | límites válidos e inválidos en test | verificado en memoria |
| 9-13 | Semana 9 p. 36 | Orden | práctica aplicada | pendiente | sort=price | API | admin-api.test.js comprueba precios 900 y 1500 | verificado en memoria |
| 9-14 | Semana 9 pp. 34–36 | Autenticación y autorización | requisito explícito | pendiente | Contraseña, sesión temporal, token para escritura | app.js; admin.js | 401 sin sesión, cierre invalida token | verificado local |
| 9-15 | Semana 9 pp. 36–38 | Documentación y pruebas | práctica aplicada | parcial | Contrato y suite | GUIA; tests | npm test con PostgreSQL, laboratorio y lectura Supabase: 22 pasan, 0 omitidas | verificado con límites |
| 9-16 | Semana 9 p. 38 | HATEOAS | explicación conceptual | pendiente | Opcional en texto; no implementado | API | Revisión del material | no aplicable: opcional |
| 9-Q1 | Semana 9 p. 41 | Propósito middleware | explicación conceptual | pendiente | Intercepta solicitud para procesarla o continuar | app.js | JSON/CORS/auth | verificado |
| 9-Q2 | Semana 9 p. 41 | Método para actualizar | explicación conceptual | pendiente | PUT reemplaza producto | API | PUT 200 en test | verificado |
| 9-Q3 | Semana 9 p. 42 | Responsabilidad controlador | explicación conceptual | parcial | Recibe solicitud, coordina servicio, responde | product-controller.js | CRUD y errores en tests HTTP | verificado |
| 9-Q4 | Semana 9 p. 42 | Buena práctica REST | explicación conceptual | pendiente | Recursos, métodos y estados | GUIA | Tests HTTP | verificado |
| 9-G | Guía 9 pasos 1–7 | Event loop, CRUD, middleware y REST | práctica aplicada | parcial | API y notas | app.js; GUIA | npm test | verificado con repositorio simulado |
| 9-E | Guía 9, ejercicio enlazado | Ejercicio evaluado externo | requisito explícito | bloqueado | Archivo no adjunto | clase9-ejercicio-evaluado.html | No encontrado | bloqueado |
| 10-01 | Semana 10 pp. 1–12; profundización pp. 1–4 | Componentes, renderizado y comparación de frameworks | explicación conceptual | parcial | Componentes nativos; comparación en notas | view.js; notas | model.test.js | verificado para NUDO; sin framework |
| 10-02 | Semana 10 pp. 13–19 | Entrada, evento y estado | práctica aplicada | existente sin verificar | Tarjeta recibe producto; evento agrega; carrito cambia | view.js; script.js; model.js | Navegador: Shampoo → carrito 1 | verificado |
| 10-03 | Semana 10 pp. 20–33 | Rutas, servicios, API y pantallas | práctica aplicada | parcial | Repositorios, controles y pantalla de búsqueda separados; varias pantallas siguen en script.js | listing.js; frontend | Inspección y pruebas | parcial |
| 10-04 | Semana 10 pp. 27–33 | Carga y error de API | práctica aplicada | parcial | Mensaje cargando y demo | catalog-repository.js; index.html | Navegador muestra demo; test caída | verificado |
| 10-05 | Semana 10 pp. 27–33 | Catálogo vacío | práctica aplicada | pendiente | Aviso y arreglo vacío | catalog-repository.js | catalog-state.test.js y navegador con repositorio vacío en localhost:3001 | verificado con datos simulados |
| 10-06 | Consigna usuario, semana 10 | Sesión y permisos UI/API | requisito explícito | pendiente | Inicio/cierre y errores | admin.html; admin.js; app.js | Formulario probado con PostgreSQL local; API Supabase probada por separado; test 401 | verificado local y API Supabase |
| 10-Q1 | Semana 10 p. 35 | Característica común de frameworks | explicación conceptual | pendiente | Componentes reutilizables | notas | Comparación conceptual | verificado |
| 10-Q2 | Semana 10 p. 35 | Estado | explicación conceptual | parcial | Datos variables que determinan vista | model.js; script.js | Carrito navegador | verificado |
| 10-Q3 | Semana 10 p. 35 | Servicio frontend | explicación conceptual | parcial | Encapsula acceso externo | catalog-repository.js | Inspección | verificado |
| 10-Q4 | Semana 10 p. 36 | Ventaja SPA | explicación conceptual | parcial | Cambia vistas sin recargar documento | rutas # | Navegador Inicio → Carrito → Pago | verificado |
| 11-01 | Semana 11 pp. 1–7 | SQL frente a NoSQL | explicación conceptual | pendiente | Comparación PostgreSQL/MongoDB | GUIA | Lectura | verificado conceptual |
| 11-02 | Semana 11 pp. 8–13 | Conexiones a otros motores | explicación conceptual | pendiente | SQL Server, MySQL y MongoDB como ejemplos | GUIA | Lectura; práctica específica SQL Server abajo | parcial |
| 11-03 | Semana 11 pp. 14–25; prof. 11 pp. 2–4 | Modelo Prisma PostgreSQL | requisito explícito | pendiente | Modelo de tabla existente | prisma/schema.prisma | prisma validate | verificado esquema; adaptación |
| 11-04 | Prof. 11 pp. 2–4 | Migración Prisma | requisito explícito | pendiente | Línea base para base vacía y migración de laboratorio relacional | prisma/migrations; prisma-lab/migrations | prisma migrate deploy en esquemas de prueba | verificado PostgreSQL local |
| 11-05 | Prof. 11 pp. 4–6 | Consulta y CRUD Prisma con relaciones | requisito explícito | pendiente | Categoría y producto relacionados en laboratorio; rutas usan repositorio propio | prisma-lab; tests/prisma-lab.test.js | create, find, update, delete y relación con PostgreSQL | verificado adaptación local |
| 11-06 | Prof. 11 pp. 1–8 | Laboratorio SQL Server y categoría-producto | requisito explícito | pendiente | Adaptación a PostgreSQL y esquema actual | GUIA | SQL Server instalado pero detenido y sin acceso configurado | bloqueado: laboratorio original no ejecutado |
| 11-07 | Semana 11 pp. 26–33 | Validación y excepciones | práctica aplicada | parcial | Validación servidor y error central | product-service.js; app.js | 400 y 503 en tests | verificado en memoria |
| 11-08 | Semana 11 p. 33; prof. 11 p. 8 | Transacción/atomicidad | práctica aplicada | pendiente | Actualizar stock con rollback local; insertar y actualizar con rollback en Supabase | tests/prisma-lab.test.js; editor SQL Supabase | rollback local y Supabase registros_de_prueba=0 | verificado; checkout no persiste pedidos |
| 11-09 | Consigna usuario, semana 11 | Lectura real Supabase | requisito explícito | existente sin verificar | Repositorio Data API | supabase-product-repository.js | SUPABASE_INTEGRATION=1, 60 productos; proyecto restaurado Healthy | verificado |
| 11-10 | Consigna usuario, semana 11 | Escritura real Supabase | requisito explícito | pendiente | CRUD por API Express y transacción SQL reversible | API; supabase-product-repository.js; editor SQL | POST 201, PUT 200 (1200→1750), GET, DELETE 204 y GET 404; sin registro temporal | verificado con Supabase real |
| 11-Q1 | Semana 11 p. 35 | Rasgo SQL | explicación conceptual | pendiente | Tablas, relaciones, SQL y ACID | GUIA | Lectura | verificado conceptual |
| 11-Q2 | Semana 11 p. 35 | Migración ORM | explicación conceptual | pendiente | Cambio versionado de esquema | GUIA; prisma/migrations | Archivo preparado | verificado conceptual |
| 11-Q3 | Semana 11 p. 35 | Por qué validar antes de persistir | explicación conceptual | pendiente | Evitar datos inválidos/inconsistentes | product-service.js | Precio negativo → 400 | verificado |
| 11-Q4 | Semana 11 p. 36 | Uso de transacciones | explicación conceptual | pendiente | Cambios de stock y fallo se revierten juntos | tests/prisma-lab.test.js | Rollback comprobado en PostgreSQL local | verificado local |
| F-01 | Consigna usuario | Checkout de regresión | requisito explícito | existente sin verificar | Checkout local intacto | frontend | Navegador: shampoo → contacto → pago local → ticket | verificado ruta local simulada |
| F-02 | Consigna usuario | Búsqueda y filtros | requisito explícito | existente sin verificar | Búsqueda sin tildes; filtro conserva consulta | model.js; listing.js | model.test.js y navegador #buscar/shampoo?precio=under-10 | verificado local |
| F-03 | Consigna usuario | Versión publicada y Render | requisito explícito | pendiente | Pasos de despliegue | GUIA; app-config.js; render.yaml | Pages config HTTP 200 vacía; /api/products HTTP 404; Render nudo-botica.onrender.com timeout 50 s, primer deploy fallido y segundo cancelado | bloqueado: falta desplegar |
| F-04 | Consigna usuario | Credenciales privadas | requisito explícito | parcial | Variables de entorno, sin secreto en cliente | app.js; catalog-provider.js | Inspección y mock cabeceras | verificado implementación; configurar acceso |

## Notas para responder y explicar

Guía 8: separar negocio de presentación evita duplicar reglas al cambiar la interfaz. 200 significa éxito, 404 recurso ausente y 500 error interno; NUDO usa 503 para indisponibilidad de catálogo. Stateless significa que cada petición contiene la información necesaria para procesarse; la sesión administrativa actual usa un token y un mapa temporal en memoria, por lo que **no es completamente stateless ni compartida entre instancias**. Un handler recibe petición/respuesta y decide qué hacer. El navegador envía preflight OPTIONS antes de ciertas solicitudes entre orígenes para consultar métodos y cabeceras permitidos.

Guía 9: el event loop coordina tareas y retoma operaciones asíncronas cuando están listas; no convierte el código de CPU intensiva en no bloqueante. Middleware procesa o deja continuar la petición, y `next(error)` lleva fallos al manejador central. Los handlers HTTP están en `product-controller.js`; `app.js` configura rutas y middleware. La paginación/filtro/orden se aplica después de leer la lista completa y es didáctica, no una consulta optimizada para catálogos grandes.

Semana 10: React, Vue y Angular usan componentes; React emplea componentes y hooks, Vue reactividad y Angular componentes y servicios con inyección de dependencias. NUDO usa JavaScript nativo con renderizado explícito, no afirma disponer de Virtual DOM o reactividad automática. Las rutas y varias pantallas permanecen mezcladas en `script.js`.

Semana 11: ACID incluye atomicidad, consistencia, aislamiento y durabilidad. Prisma proporciona cliente, modelos y migraciones; NUDO conserva el acceso SQL/Data API previo. En el material, proveedor, eliminación lógica, transacción y API Prisma se presentan como extensiones sugeridas del laboratorio. PostgreSQL local se comprobó con dos esquemas de práctica; no se comprobó otro motor ni se ha registrado un pedido. El flujo local de pago es una demostración sin cobro.

## Verificación de Supabase y Render — 16-11-2026

El proyecto `ecommerce-capilar` estaba pausado. Se reanudó y Supabase confirmó restauración completa y estado Healthy. El editor SQL devolvió 60 filas, RLS=true y la política `nudo_public_read_products` SELECT para anon/authenticated. Una transacción con `SET LOCAL ROLE service_role` insertó y actualizó un identificador temporal, comprobó el precio y ejecutó ROLLBACK; una consulta posterior devolvió 0 registros temporales. La API Express creó, consultó, actualizó y eliminó un producto temporal en Supabase; se comprobó que quedó eliminado. La clave secreta se utilizó únicamente en memoria. Render contiene el servicio existente `nudo-botica`, conectado a `main`, con URL https://nudo-botica.onrender.com; el primer despliegue falló con código 254, el segundo fue cancelado y los logs históricos expiraron. La solicitud pública agotó 50 segundos. Se guardaron sin desplegar SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, FRONTEND_ORIGIN y HOST. El comando de compilación sigue siendo `yarn` y debe corregirse a `npm ci --prefix backend`; faltan ADMIN_PASSWORD y SUPABASE_SECRET_KEY en Render.
