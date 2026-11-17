'use strict';
// Laboratorio aislado: precios en centavos. No se usa en el checkout ni en la API de producción.
function validateProduct(data) {
  if (!data || typeof data.nombre !== 'string' || data.nombre.trim().length < 3 || data.nombre.length > 200) throw new Error('Nombre inválido');
  if (!Number.isSafeInteger(data.precio) || data.precio < 0 || data.precio > 10000000) throw new Error('Precio inválido');
  if (!Number.isSafeInteger(data.stock) || data.stock < 0 || data.stock > 1000000) throw new Error('Stock inválido');
  if (!Number.isSafeInteger(data.categoriaId) || data.categoriaId < 1) throw new Error('Categoría inválida');
  return { nombre:data.nombre.trim(), precio:data.precio, stock:data.stock, categoriaId:data.categoriaId };
}
function createLabService(prisma) {
  return {
    create: data => prisma.producto.create({data:validateProduct(data)}),
    list: () => prisma.producto.findMany({include:{categoria:true},orderBy:{id:'asc'}}),
    get: id => prisma.producto.findUnique({where:{id},include:{categoria:true}}),
    update: (id,data) => prisma.producto.update({where:{id},data:validateProduct(data)}),
    remove: id => prisma.producto.delete({where:{id}})
  };
}
module.exports = {validateProduct,createLabService};
