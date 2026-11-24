'use strict';
const { randomUUID } = require('node:crypto');
function createSupplierRepository(prisma) {
  return {
    list: () => prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    links: () => prisma.productSupplier.findMany(),
    async create(name) {
      try { return await prisma.supplier.create({ data: { id: randomUUID(), name } }); }
      catch (error) { if (error.code === 'P2002') { error.status = 409; error.message = 'El proveedor ya existe'; } throw error; }
    },
    async saveProduct(product, supplierId, isNew) {
      try {
        return await prisma.$transaction(async tx => {
          const supplier = await tx.supplier.findUnique({ where: { id: supplierId } });
          if (!supplier) { const e = Error('Proveedor no encontrado'); e.status = 400; throw e; }
          if (isNew) {
            const last = await tx.product.aggregate({ _max: { position: true } });
            await tx.product.create({ data: { id: product.id, position: (last._max.position ?? -1) + 1, data: product } });
          } else {
            const updated = await tx.product.updateMany({ where: { id: product.id }, data: { data: product } });
            if (!updated.count) { const e = Error('Producto no encontrado'); e.status = 404; throw e; }
          }
          await tx.productSupplier.upsert({ where: { productId: product.id }, create: { productId: product.id, supplierId }, update: { supplierId } });
          return product;
        });
      } catch (error) { if (error.code === 'P2002') { error.status = 409; error.message = 'El producto ya existe'; } throw error; }
    }
  };
}
module.exports = { createSupplierRepository };
