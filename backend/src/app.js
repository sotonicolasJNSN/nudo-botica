'use strict';
const { randomBytes, randomUUID, timingSafeEqual } = require('node:crypto');
const http = require('node:http');
const path = require('node:path');
const express = require('express');
const { createProductService } = require('./services/product-service');
const { createProductController } = require('./controllers/product-controller');

function createApp(repository, { frontendOrigin, adminPassword = process.env.ADMIN_PASSWORD } = {}) {
  const app = express();
  const controller = createProductController(createProductService(repository));
  const sessions = new Map();
  const attempts = new Map();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set('X-Request-Id', randomUUID());
    res.set('X-Content-Type-Options', 'nosniff');
    if (frontendOrigin) {
      res.vary('Origin');
      if (req.get('Origin') === frontendOrigin) res.set('Access-Control-Allow-Origin', frontendOrigin);
    }
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(204).end();
    }
    next();
  });
  app.use(express.json({ limit: '32kb' }));
  app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.post('/api/session', (req, res) => {
    const now = Date.now();
    const attempt = attempts.get(req.ip) || { count: 0, until: now + 60000 };
    if (now > attempt.until) { attempt.count = 0; attempt.until = now + 60000; }
    if (++attempt.count > 10) return res.status(429).json({ error: 'Demasiados intentos; espera un minuto' });
    attempts.set(req.ip, attempt);
    const supplied = typeof req.body?.password === 'string' ? req.body.password : '';
    const valid = typeof adminPassword === 'string' && adminPassword.length >= 14 &&
      Buffer.byteLength(supplied) === Buffer.byteLength(adminPassword) &&
      timingSafeEqual(Buffer.from(supplied), Buffer.from(adminPassword));
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas o administración no configurada' });
    attempts.delete(req.ip);
    const token = randomBytes(32).toString('hex');
    sessions.set(token, now + 60 * 60 * 1000);
    res.json({ token, expiresIn: 3600 });
  });
  function authorize(req, res, next) {
    const token = /^Bearer ([0-9a-f]{64})$/.exec(req.get('Authorization') || '')?.[1];
    const expiry = sessions.get(token);
    if (!expiry || expiry <= Date.now()) { sessions.delete(token); return res.status(401).json({ error: 'Sesión requerida o vencida' }); }
    req.sessionToken = token; next();
  }
  app.delete('/api/session', authorize, (req, res) => { sessions.delete(req.sessionToken); res.status(204).end(); });
  const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
  for (const base of ['/api/products', '/api/v1/products']) {
    const router = express.Router();
    router.get('/', asyncRoute(controller.list));
    router.get('/:id', asyncRoute(controller.get));
    router.post('/', authorize, asyncRoute(controller.create));
    router.put('/:id', authorize, asyncRoute(controller.update));
    router.delete('/:id', authorize, asyncRoute(controller.remove));
    app.use(base, router);
  }
  app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use(express.static(path.resolve(__dirname, '../../frontend'), { index: 'index.html' }));
  app.use((req, res) => res.status(404).send('No encontrado'));
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Solicitud demasiado grande' });
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(`Error de catálogo [${res.get('X-Request-Id')}]:`, err.message);
    res.status(503).json({ error: 'Catálogo no disponible' });
  });
  return http.createServer(app);
}
module.exports = { createApp };
