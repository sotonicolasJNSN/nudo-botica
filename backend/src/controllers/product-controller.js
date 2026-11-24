'use strict';
// Traduce HTTP a operaciones del servicio; los errores se propagan al middleware central.
function createProductController(service) {
  return {
    async list(req, res) {
      let products = await service.list();
      if (req.query.category) products = products.filter(product => product.category === req.query.category);
      if (req.query.sort === 'price') products = [...products].sort((a, b) => a.price - b.price);
      if (req.query.limit !== undefined || req.query.offset !== undefined) {
        const limit = Number(req.query.limit ?? 100), offset = Number(req.query.offset ?? 0);
        if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0) return res.status(400).json({ error:'Paginación inválida' });
        products = products.slice(offset, offset + limit);
      }
      return res.json(products);
    },
    async get(req, res) {
      const product = await service.get(req.params.id);
      return product ? res.json(product) : res.status(404).json({ error:'Producto no encontrado' });
    },
    async create(req, res) {
      const product = await service.create(req.body);
      return res.status(201).location(`${req.baseUrl}/${encodeURIComponent(product.id)}`).json(product);
    },
    async update(req, res) {
      const product = await service.update(req.params.id, req.body);
      return product ? res.json(product) : res.status(404).json({ error:'Producto no encontrado' });
    },
    async remove(req, res) {
      return await service.remove(req.params.id) ? res.status(204).end() : res.status(404).json({ error:'Producto no encontrado' });
    },
    async placeOrder(req, res) {
      return res.status(200).json(await service.placeOrder(req.body));
    }
  };
}
module.exports = { createProductController };
