'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createProductController } = require('./controllers/product-controller');
const { createProductService } = require('./services/product-service');

const frontend = path.resolve(__dirname, '../../frontend');
const staticFiles = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']], ['/model.js', ['model.js', 'text/javascript']],
  ['/view.js', ['view.js', 'text/javascript']], ['/script.js', ['script.js', 'text/javascript']],
  ['/catalog-repository.js', ['catalog-repository.js', 'text/javascript']],
  ['/cart-repository.js', ['cart-repository.js', 'text/javascript']]
]);

function createApp(repository) {
  const listProducts = createProductController(createProductService(repository));
  return http.createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (req.method !== 'GET') { res.writeHead(405, { Allow: 'GET' }); return res.end(); }
    if (pathname === '/api/products') return listProducts(req, res);
    const file = staticFiles.get(pathname);
    if (!file) { res.writeHead(404); return res.end('No encontrado'); }
    try {
      const content = await fs.readFile(path.join(frontend, file[0]));
      res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'X-Content-Type-Options': 'nosniff' });
      res.end(content);
    } catch {
      res.writeHead(500); res.end('No se pudo cargar la página');
    }
  });
}
module.exports = { createApp };
