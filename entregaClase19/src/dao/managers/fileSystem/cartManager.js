const fs = require("fs").promises;
const pathHandler = require("path");
const currentPath = __dirname;
const defaultPath = pathHandler.join(currentPath, "..", "..", "..", "..", "data");
const ProductManager = require("./productManager");

const productManager = new ProductManager();

class CartsManager {
  constructor(path = defaultPath, filename = "carts.json") {
    this.path = path;
    this.filename = filename;
    this.filepath = pathHandler.join(this.path, this.filename);
  }

  async checkIfFileExists() {
    process.env.VERBOSE && console.log("Checking if the carts file exists");
    try {
      await fs.access(this.filepath);
      process.env.VERBOSE && console.log("The carts file exists");
      return true;
    } catch {
      process.env.VERBOSE && console.log("The carts file does not exist. It will be created");
      return false;
    }
  }

  async createCartsFile() {
    try {
      process.env.VERBOSE && console.log("Creating the carts file");
      await fs.writeFile(this.filepath, "[]");
      process.env.VERBOSE && console.log(`The carts file ${this.filename} was created`);
    } catch (error) {
      console.error("Error while trying to create the carts file:\n", error);
    }
  }

  async getCarts() {
    try {
      const fileExists = await this.checkIfFileExists();
      if (!fileExists) {
        await this.createCartsFile();
      }
      process.env.VERBOSE && console.log("Retrieving the list of carts");
      const data = await fs.readFile(this.filepath, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      console.error("Error while trying to get the carts:\n", error);
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    const matchedCart = carts.find(cart => cart.id === id);
    if (matchedCart) {
      process.env.VERBOSE &&
        console.log(`The cart that matched the id ${id} is:\n${JSON.stringify(matchedCart)}`);
      return matchedCart;
    } else {
      console.error(`No cart was found with the id ${id}`);
    }
  }

  async writeCarts(carts) {
    const cartsData = JSON.stringify(carts, null, 2);
    try {
      process.env.VERBOSE && console.log(`Writing the carts to the file ${this.filename}`);
      await fs.writeFile(this.filepath, cartsData);
    } catch (error) {
      console.error(`Error while trying to save the carts to the file ${this.filename}:\n${error}`);
    }
  }

  async addCart() {
    const carts = await this.getCarts();
    if (!carts) {
      return;
    }
    const newId = carts[carts.length - 1]?.id + 1 || 0;
    const newCart = {
      id: newId,
      products: []
    };
    carts.push(newCart);
    await this.writeCarts(carts);
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    // If the cart with cartId exists on carts.json
    if (cart) {
      const product = await productManager.getProductById(productId);
      // If the product with productId exists on products.json
      if (product) {
        const productInCart = cart.products.find(product => product.product === productId);
        // If the cart already has that product added, increase its quantity by 1
        if (productInCart) {
          const newProductQuantity = product.quantity + 1;
          const newProductInCart = {
            product: productId,
            quantity: newProductQuantity
          };
          productInCart.quantity += 1;
          process.env.VERBOSE && console.log(newProductInCart);
          // If the cart does NOT have that product added, set its initial quantity to 1
        } else {
          const newProductInCart = {
            product: productId,
            quantity: 1
          };
          cart.products.push(newProductInCart);
        }
        // Get the carts, and replace the old cart with new cart containing its correspondant quantity
        const carts = await this.getCarts();
        carts.forEach((oldCart, index) => {
          if (oldCart.id === cartId) {
            carts[index] = cart;
          }
        });
        await this.writeCarts(carts);
        return cart;
      } else {
        console.error(`No matching product was found with the ID ${productId}`);
      }
    } else {
      console.error(`No matching cart was found with the ID ${cartId}`);
    }
  }
}

module.exports = CartsManager;
