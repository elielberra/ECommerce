const fs = require("fs").promises;
const pathHandler = require("path");
const currentPath = __dirname;
const defaultPath = pathHandler.join(currentPath, "..", "..", "data");

class ProductManager {
  constructor(path = defaultPath, filename = "products.json") {
    this.path = path;
    this.filename = filename;
    this.filepath = pathHandler.join(this.path, this.filename);
  }

  async checkIfFileExists() {
    console.log("Checking if the products file exists");
    try {
      await fs.access(this.filepath);
      console.log("The products file exists");
      return true;
    } catch {
      console.log("The products file does not exist. It will be created");
      return false;
    }
  }

  async createProductsFile() {
    try {
      console.log("Creating the products file");
      await fs.writeFile(this.filepath, "[]");
      console.log(`The products file ${this.filename} was created`);
    } catch (error) {
      console.error("Error while trying to create the products file:\n", error);
    }
  }

  async getProducts() {
    try {
      const fileExists = await this.checkIfFileExists();
      if (!fileExists) {
        await this.createProductsFile();
      }
      console.log("Retrieving the list of products");
      const data = await fs.readFile(this.filepath, "utf-8");
      const products = JSON.parse(data);
      const productsTitles = products.map(product => product.title).join(', ');
      console.log(`The products are: ${productsTitles}`)
      return products;
    } catch (error) {
      console.error("Error while trying to get the products:\n", error);
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const matchedProduct = products.find((product) => product.id === id);
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

  async getRandomProduct() {
    const products = await this.getProducts();
    const productIds = products.map(product => product.id)
    // Retrieve a random element of the array of the products IDs
    const randomIndex = Math.floor(Math.random() * productIds.length);
    const randomProduct = products[randomIndex]
    return randomProduct
  }

  validateReqFields(product) {
    const mandatoryFields = [
      "id",
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
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

  validateCodeUnique(existingProducts, product) {
    const existingCodes = existingProducts.map((product) => product.code);
    console.log("Validating if the code is unique");
    if (existingCodes.includes(product.code)) {
      throw new Error(
        "The product's code already exists, therefore, the product will NOT be added to the list"
      );
    } else {
      console.log("The code is unique. The product will be registered");
    }
  }

  async writeProducts(products) {
    const productsData = JSON.stringify(products, null, 2);
    try {
      console.log(`Writing the products to the file ${this.filename}`);
      await fs.writeFile(this.filepath, productsData);
    } catch (error) {
      console.error(
        `Error while trying to save the products to the file ${this.filename}:\n${error}`
      );
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    if (!products) {
      return;
    }
    const newId = products[products.length - 1]?.id + 1 || 0;
    const newProduct = {
      id: newId,
      status: true,
      ...product,
    };
    try {
      this.validateReqFields(newProduct);
      this.validateCodeUnique(products, newProduct);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
    console.log("A new product will be added. The new product is:\n", newProduct)
    products.push(newProduct);
    await this.writeProducts(products);
    console.log("The product has been successfully saved on the Database")
    return newProduct;
  }

  async updateProduct(id, fieldsToUpdate) {
    const products = await this.getProducts();
    for (const product of products) {
      if (product.id == id) {
        Object.entries(fieldsToUpdate).forEach(
          ([prop, value]) => (product[prop] = value)
        );
        console.log("Updated product: ", JSON.stringify(product));
        await this.writeProducts(products);
        return product;
      }
    }
    console.log(`No matching product was found with the id ${id}`);
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    console.log(`Deleting the product with id ${id}`);
    const filteredProducts = products.filter((product) => product.id != id);
    if (JSON.stringify(products) === JSON.stringify(filteredProducts)) {
      console.error(`No atribute with the id ${id} was found`);
      return;
    }
    await this.writeProducts(filteredProducts);
  }
}

module.exports = ProductManager;
