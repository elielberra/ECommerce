class ProductsCodeExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductsCodeExistsError";
  }
}

class ItemNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "ItemNotFoundError";
  }
}

module.exports = { ProductsCodeExistsError, ItemNotFoundError };
