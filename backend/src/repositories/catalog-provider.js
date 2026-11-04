'use strict';
const { createProductRepository } = require('./product-repository');
const { createSupabaseProductRepository } = require('./supabase-product-repository');

function createCatalogProvider(env, createPool) {
  if (env.CATALOG_SOURCE === 'postgres') {
    const pool = createPool(env.DATABASE_URL ? { connectionString: env.DATABASE_URL } : { database: env.PGDATABASE || 'nudo' });
    return { repository: createProductRepository(pool), close: () => pool.end() };
  }
  if (env.SUPABASE_URL || env.SUPABASE_PUBLISHABLE_KEY) {
    if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
      throw new Error('Configure SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY conjuntamente');
    }
    return { repository: createSupabaseProductRepository({ url: env.SUPABASE_URL, publishableKey: env.SUPABASE_PUBLISHABLE_KEY }), close: async () => {} };
  }
  const pool = createPool(env.DATABASE_URL ? { connectionString: env.DATABASE_URL } : { database: env.PGDATABASE || 'nudo' });
  return { repository: createProductRepository(pool), close: () => pool.end() };
}
module.exports = { createCatalogProvider };
