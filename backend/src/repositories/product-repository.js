'use strict';
const { mapInventoryError } = require('./inventory-error');
function createProductRepository(pool) {
  return {
    async list() { const result = await pool.query('SELECT data FROM products ORDER BY position, id'); return result.rows.map(row => row.data); },
    async get(id) { const result = await pool.query('SELECT data FROM products WHERE id = $1', [id]); return result.rows[0]?.data; },
    async create(product) {
      try { const result = await pool.query('INSERT INTO products (id, position, data) VALUES ($1, COALESCE((SELECT MAX(position)+1 FROM products), 0), $2) RETURNING data', [product.id, product]); return result.rows[0].data; }
      catch (err) { if (err.code === '23505') { err.status = 409; err.message = 'El producto ya existe'; } throw err; }
    },
    async update(id, product) { const result = await pool.query('UPDATE products SET data = $2 WHERE id = $1 RETURNING data', [id, product]); return result.rows[0]?.data; },
    async remove(id) { const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]); return result.rowCount > 0; },
    async placeOrder(order) {
      try {
        const result = await pool.query('SELECT nudo_place_order($1, $2::jsonb) AS result', [order.reference, JSON.stringify(order.items)]);
        return result.rows[0].result;
      } catch (error) {
        throw mapInventoryError(error);
      }
    },
    async listInventoryMovements({ productId, limit, offset }) {
      try {
        const result = await pool.query(
          `SELECT id::text AS id, product_id AS "productId", product_name AS "productName",
                  movement_type AS "movementType", quantity::integer AS quantity,
                  stock_before::integer AS "stockBefore", stock_after::integer AS "stockAfter",
                  reference, notes, created_at AS "createdAt"
           FROM nudo_inventory_movements
           WHERE ($1::text IS NULL OR product_id = $1)
           ORDER BY created_at DESC, id DESC
           LIMIT $2 OFFSET $3`,
          [productId, limit, offset]
        );
        return result.rows;
      } catch (error) {
        throw mapInventoryError(error);
      }
    },
    async receiveStock(receipt) {
      try {
        const result = await pool.query(
          'SELECT nudo_receive_stock($1, $2::jsonb, $3) AS result',
          [receipt.reference, JSON.stringify(receipt.items), receipt.notes]
        );
        return result.rows[0].result;
      } catch (error) {
        throw mapInventoryError(error);
      }
    }
  };
}
module.exports = { createProductRepository };
