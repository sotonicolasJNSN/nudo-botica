'use strict';
function createInventoryController(service) {
  return {
    async listMovements(req, res) {
      return res.json(await service.listMovements(req.query));
    },
    async receiveStock(req, res) {
      return res.status(201).json(await service.receiveStock(req.body));
    }
  };
}
module.exports = { createInventoryController };
