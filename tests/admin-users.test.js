'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../backend/src/app');
const { hashPassword, createAdminUserRepository } = require('../backend/src/repositories/admin-user-repository');

test('usuario y contraseña se validan contra hashes y protegen las escrituras', async t => {
  const passwordHash = await hashPassword('clave-de-prueba');
  assert.notEqual(passwordHash, 'clave-de-prueba');
  const users = createAdminUserRepository({ adminUser: { findUnique: async ({ where }) => where.username === 'usuario-prueba' ? { passwordHash } : null } });
  const server = createApp({ list: async () => [] }, { adminUsers: users });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function login(username, password) {
    return fetch(`${base}/api/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
  }
  assert.equal((await login('usuario-inexistente', 'clave-de-prueba')).status, 401);
  assert.equal((await login('usuario-prueba', 'incorrecta')).status, 401);
  const response = await login('usuario-prueba', 'clave-de-prueba');
  assert.equal(response.status, 200);
  const { token } = await response.json();
  assert.match(token, /^[0-9a-f]{64}$/);
  assert.equal((await fetch(`${base}/api/session`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })).status, 204);
});
