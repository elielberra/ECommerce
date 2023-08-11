const cartsModel = require("../../models/cartModel");
const mongoose = require("mongoose");

class CartManager {
  async getCarts() {
    const carts = await cartsModel.find();
    return carts;
  }

  async getCart(filter) {
    const cart = await cartsModel.findOne(filter);
    return cart;
  }

  async getCartById(id, lean) {
    // const matchedCart = await cartsModel.findOne({ _id: id });
    let matchedCart = null;
    console.log(lean);
    if (lean) {
      console.debug("cartById is lean");
      matchedCart = await cartsModel
        .findOne({ _id: id })
        .populate({
          path: "products.product",
          select: ["title", "price", "category", "keywords", "description", "thumbnail"]
        })
        .lean();
    } else {
      console.debug("cartById is NOT lean");
      matchedCart = await cartsModel.findOne({ _id: id }).populate({
        path: "products.product",
        select: ["title", "price", "category", "keywords", "description", "thumbnail"]
      });
    }
    console.debug(
      "matchedCart is instance of mongoose object:",
      matchedCart instanceof mongoose.Query || matchedCart instanceof mongoose.Aggregate
    );
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
    console.log("inside addProductToCarta")
    const cart = await this.getCartById(cartId, false);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const existingProductIndex = cart.products.findIndex(
      product => product.product.toString() === productId
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    return cart;
  }

  async deleteCart(id) {
    const dbOperationResult = await cartsModel.deleteOne({ _id: id });
    return dbOperationResult;
  }

  // async deleteProductFromCart(cartId, productId) {}
}

module.exports = new CartManager();
