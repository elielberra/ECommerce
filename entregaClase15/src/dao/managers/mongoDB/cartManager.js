const cartsModel = require("../../models/cartModel");

class CartsManager {
  async getCarts() {
    const carts = await cartsModel.find();
    return carts;
  }

  async getCartById(id) {
    const matchedCart = await cartsModel.find({ _id: id });
    if (matchedCart) {
      console.log(
        `The cart that matched the id ${id} is:\n${JSON.stringify(matchedCart)}`
      );
      return matchedCart;
    } else {
      console.error(`No cart was found with the id ${id}`);
    }
  }

  async addCart(cart) {
    const newCart = await cartsModel.create(cart);
    console.log("The cart has been successfully saved on the Database");
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    // products population is missing, this method will not work
    const cart = await this.getCartById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    console.debug(cart)
    const existingProductIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
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
    console.log(`Deleting the cart with id ${id}`);
    const dbOperationResult = await cartsModel.deleteOne({ _id: id });
    return dbOperationResult;
  }
}

module.exports = CartsManager;
