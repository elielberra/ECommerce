class ProductCodeExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductCodeExistsError";
  }
}

module.exports = ProductCodeExistsError;
