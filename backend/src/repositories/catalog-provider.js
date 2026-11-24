'use strict';
const { createProductRepository } = require('./product-repository');
const { createSupabaseProductRepository } = require('./supabase-product-repository');
const { createPrismaProductRepository } = require('./prisma-product-repository');

function createCatalogProvider(env, createPool) {
  if (env.CATALOG_SOURCE && !['postgres', 'supabase', 'prisma'].includes(env.CATALOG_SOURCE)) {
    throw new Error('CATALOG_SOURCE must be postgres, supabase or prisma');
  }
  if (env.CATALOG_SOURCE === 'prisma') {
    if (!env.DATABASE_URL) throw new Error('Configure DATABASE_URL para Prisma');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
    return { repository: createPrismaProductRepository(prisma), close: () => prisma.$disconnect() };
  }
  if (env.CATALOG_SOURCE === 'postgres') {
    const pool = createPool(env.DATABASE_URL ? { connectionString: env.DATABASE_URL } : { database: env.PGDATABASE || 'nudo' });
    return { repository: createProductRepository(pool), close: () => pool.end() };
  }
  if (env.CATALOG_SOURCE === 'supabase' || env.SUPABASE_URL || env.SUPABASE_PUBLISHABLE_KEY) {
    if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
      throw new Error('Configure SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY conjuntamente');
    }
    return { repository: createSupabaseProductRepository({ url: env.SUPABASE_URL, publishableKey: env.SUPABASE_PUBLISHABLE_KEY, secretKey: env.SUPABASE_SECRET_KEY }), close: async () => {} };
  }
  const pool = createPool(env.DATABASE_URL ? { connectionString: env.DATABASE_URL } : { database: env.PGDATABASE || 'nudo' });
  return { repository: createProductRepository(pool), close: () => pool.end() };
}
module.exports = { createCatalogProvider };
