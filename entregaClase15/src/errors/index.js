class ProductsCodeExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductsCodeExistsError";
  }
}

module.exports = ProductsCodeExistsError;
