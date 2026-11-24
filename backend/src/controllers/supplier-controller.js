'use strict';
function createSupplierController(service) {
  return {
    list: async (req, res) => res.json(await service.list()),
    links: async (req, res) => res.json(await service.links()),
    create: async (req, res) => res.status(201).json(await service.create(req.body)),
    createProduct: async (req, res) => res.status(201).json(await service.saveProduct(req.body)),
    updateProduct: async (req, res) => res.json(await service.saveProduct(req.body, req.params.id))
  };
}
module.exports = { createSupplierController };
