'use strict';
const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const derive = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derive(password, salt, 64);
  return `scrypt$${salt}$${hash.toString('hex')}`;
}
async function verifyPassword(password, encoded) {
  const [scheme, salt, hash] = String(encoded || '').split('$');
  if (scheme !== 'scrypt' || !/^[0-9a-f]{32}$/.test(salt || '') || !/^[0-9a-f]{128}$/.test(hash || '')) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = await derive(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}
function createAdminUserRepository(prisma) {
  return {
    async verify(username, password) {
      if (typeof username !== 'string' || username.length > 80 || typeof password !== 'string' || password.length > 500) return false;
      const user = await prisma.adminUser.findUnique({ where: { username } });
      return user ? verifyPassword(password, user.passwordHash) : false;
    }
  };
}
module.exports = { hashPassword, verifyPassword, createAdminUserRepository };
