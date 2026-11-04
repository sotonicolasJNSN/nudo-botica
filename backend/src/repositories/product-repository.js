'use strict';

function createProductRepository(pool) {
  return {
    async list() {
      const result = await pool.query('SELECT data FROM products ORDER BY position, id');
      return result.rows.map(row => row.data);
    }
  };
}
module.exports = { createProductRepository };
