'use strict';

function createProductService(repository) {
  return { list: () => repository.list() };
}
module.exports = { createProductService };
