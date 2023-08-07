const productsModel = require("../../models/productModel");

class ProductManager {
  async getProducts() {
    try {
      const products = await productsModel.find();
      const productsTitles = products
        .map((product) => product.title)
        .join(", ");
      console.log(`The products are: ${productsTitles}`);
      return products;
    } catch (error) {
      console.error("Error while trying to get the products:\n", error);
    }
  }

  async getProductById(id) {
    const matchedProduct = await productsModel.findOne({ _id: id });
    if (matchedProduct) {
      console.log(
        `The product that matched the id ${id} is:\n${JSON.stringify(
          matchedProduct
        )}`
      );
      return matchedProduct;
    } else {
      console.error(`No product was found with the id ${id}`);
    }
  }

  validateReqFields(product) {
    const mandatoryFields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "keywords",
    ];
    for (const mandatoryField of mandatoryFields) {
      if (!(mandatoryField in product)) {
        throw new Error(
          `Please insert the mandatory field '${mandatoryField}' for creating a product`
        );
      }
    }
    console.log("All the required fields were entered");
  }

  async validateCodeUnique(product) {
    console.debug(product);
    const existingCodes = await productsModel.distinct("code");
    console.debug(existingCodes);
    console.log("Validating if the code is unique");
    if (existingCodes.includes(product.code)) {
      throw new Error(
        "The product's code already exists, therefore, the product will NOT be added to the list"
      );
    } else {
      console.log("The code is unique. The product will be registered");
    }
  }

  async addProduct(product) {
    try {
      console.debug(product);
      this.validateReqFields(product);
      this.validateCodeUnique(product);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
    console.log("A new product will be added. The new product is:\n", product);
    const newProduct = await productsModel.create(product);
    console.log("The product has been successfully saved on the Database");
    return newProduct;
  }

  async updateProduct(id, fieldsToUpdate) {
    try {
      const dbOperationResult = await productsModel.updateOne(
        { _id: id },
        fieldsToUpdate
      );
      return dbOperationResult;
    } catch (error) {
      console.log(`No matching product was found with the id ${id}`);
    }
  }

  async deleteProduct(id) {
    console.log(`Deleting the product with id ${id}`);
    const dbOperationResult = await productsModel.deleteOne({ _id: id });
    return dbOperationResult;
  }
}

module.exports = ProductManager;
