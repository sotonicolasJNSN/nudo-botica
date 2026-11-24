'use strict';
function createSupplierController(service) {
  return {
    list: async (req, res) => res.json(await service.list()),
    links: async (req, res) => res.json(await service.links()),
    create: async (req, res) => res.status(201).json(await service.create(req.body)),
    remove: async (req, res) => await service.remove(req.params.id) ? res.status(204).end() : res.status(404).json({error:'Proveedor no encontrado'}),
    createProduct: async (req, res) => res.status(201).json(await service.saveProduct(req.body)),
    updateProduct: async (req, res) => res.json(await service.saveProduct(req.body, req.params.id))
  };
}
module.exports = { createSupplierController };
