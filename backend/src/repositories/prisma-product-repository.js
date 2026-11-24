'use strict';

// Conserva el mismo contrato que los repositorios PostgreSQL y Supabase.
function createPrismaProductRepository(prisma) {
  return {
    async list() {
      const rows = await prisma.product.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }] });
      return rows.map(row => row.data);
    },
    async get(id) {
      const row = await prisma.product.findUnique({ where: { id } });
      return row?.data;
    },
    async create(product) {
      try {
        // Mantiene la misma asignación de posición que los repositorios existentes.
        const last = await prisma.product.aggregate({ _max: { position: true } });
        const row = await prisma.product.create({ data: { id: product.id, position: (last._max.position ?? -1) + 1, data: product } });
        return row.data;
      } catch (error) {
        if (error.code === 'P2002') { error.status = 409; error.message = 'El producto ya existe'; }
        throw error;
      }
    },
    async update(id, product) {
      // updateMany evita que una ausencia provoque una excepción P2025.
      const result = await prisma.product.updateMany({ where: { id }, data: { data: product } });
      return result.count ? product : undefined;
    },
    async remove(id) {
      const result = await prisma.product.deleteMany({ where: { id } });
      return result.count > 0;
    }
  };
}
module.exports = { createPrismaProductRepository };
