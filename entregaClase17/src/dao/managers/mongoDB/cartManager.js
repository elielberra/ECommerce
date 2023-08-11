const cartsModel = require("../../models/cartModel");
const { ItemNotFoundError } = require("../../../errors");

class CartManager {
  async getCarts() {
    const carts = await cartsModel.find().populate({
      path: "products.product",
      select: ["title", "price", "category", "keywords", "description", "thumbnail"]
    });
    return carts;
  }

  async getCart(filter) {
    const cart = await cartsModel.findOne(filter);
    return cart;
  }

  async getCartById(id, willReturnLeanObject) {
    let matchedCart = null;
    if (willReturnLeanObject) {
      matchedCart = await cartsModel
        .findOne({ _id: id })
        .populate({
          path: "products.product",
          select: ["title", "price", "category", "keywords", "description", "thumbnail"]
        })
        .lean();
    } else {
      matchedCart = await cartsModel.findOne({ _id: id }).populate({
        path: "products.product",
        select: ["title", "price", "category", "keywords", "description", "thumbnail"]
      });
    }
    if (matchedCart) {
      process.env.VERBOSE &&
        console.log(`The cart that matched the id ${id} is:\n${JSON.stringify(matchedCart)}`);
      return matchedCart;
    } else {
      console.error(`No cart was found with the id ${id}`);
    }
  }

  async addCart(cart) {
    const newCart = await cartsModel.create(cart);
    process.env.VERBOSE && console.log("The cart has been successfully saved on the Database");
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const willReturnLeanObject = false;
    const cart = await this.getCartById(cartId, willReturnLeanObject);
    if (!cart) {
      throw new ItemNotFoundError(`The product with the id ${productId} not found`);
    }
    const existingProductIndex = cart.products.findIndex(
      product => product.product?._id?.toString() === productId
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    const willReturnLeanObject = false;
    const cart = await this.getCartById(cartId, willReturnLeanObject);
    if (!cart) {
      throw new ItemNotFoundError(`The cart with the id ${cartId} not found`);
    }
    const indexProductToUpdate = cart.products.findIndex(
      product => product.product?._id?.toString() === productId
    );
    if (indexProductToUpdate === -1) {
      throw new ItemNotFoundError(`The product with the id ${productId} not found`);
    }
    cart.products[indexProductToUpdate].quantity = newQuantity;
    await cart.save();
    return cart;
  }

  async deleteOneProductFromCart(cartId, productId) {
    const willReturnLeanObject = false;
    const cart = await this.getCartById(cartId, willReturnLeanObject);
    if (!cart) {
      throw new ItemNotFoundError(`The cart with the id ${cartId} not found`);
    }
    const indexProductToDelete = cart.products.findIndex(
      product => product.product?._id?.toString() === productId
    );
    if (indexProductToDelete === -1) {
      throw new ItemNotFoundError(`The product with the id ${productId} not found`);
    }
    const numOfElementsToDelete = 1;
    cart.products.splice(indexProductToDelete, numOfElementsToDelete);
    await cart.save();
    return cart;
  }

  async deleteAllProductsFromCart(cartId) {
    const willReturnLeanObject = false;
    const cart = await this.getCartById(cartId, willReturnLeanObject);
    if (!cart) {
      throw new ItemNotFoundError(`The cart with the id ${cartId} not found`);
    }
    cart.products = [];
    cart.save();
    return cart;
  }
}

module.exports = new CartManager();
