'use strict';

function createProductController(service) {
  return async function listProducts(req, res) {
    try {
      const products = await service.list();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(products));
    } catch (error) {
      console.error('No se pudo consultar el catálogo:', error.message);
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: 'Catálogo no disponible' }));
    }
  };
}
module.exports = { createProductController };
