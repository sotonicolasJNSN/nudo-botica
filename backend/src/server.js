'use strict';
const { Pool } = require('pg');
const { createApp } = require('./app');
const { createCatalogProvider } = require('./repositories/catalog-provider');

// Las variables PGHOST, PGPORT, PGDATABASE, PGUSER y PGPASSWORD son admitidas por pg.
const env = { ...process.env };
const provider = createCatalogProvider(env, options => new Pool(options));
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const server = createApp(provider.repository, { frontendOrigin: process.env.FRONTEND_ORIGIN });
server.listen(port, host, () => console.log(`NUDO disponible en http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => provider.close().finally(() => process.exit(0))));
}
