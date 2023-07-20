const ProductManager = require("../managers/productManager.js");
const CartManager = require("../managers/cartManager.js");
const { getRandomRoundNumber } = require("../utils");
const productManager = new ProductManager();
const cartManager = new CartManager();

async function sendInitialDiscount(socket) {
  const product = await productManager.getRandomProduct();
  socket.emit("promo", { title: product.title, sale: 15 });
}

function socketManager(socket) {
  console.log(
    `A new connection has been established with this socket with the id: ${socket.id}`
  );
  sendInitialDiscount(socket);

  socket.on("loadInitialCartBadge", async ({ cartId }) => {
    const cart = await cartManager.getCartById(cartId);
    const cartProducts = cart.products;
    socket.emit("productsInCart", cartProducts);
  });

  socket.on("promo", async () => {
    const product = await productManager.getRandomProduct();
    const saleDiscount = getRandomRoundNumber(10, 50);
    console.log("saleDiscount", saleDiscount);
    socket.emit("promo", { title: product.title, sale: saleDiscount });
  });

  socket.on("addToCart", async ({ cartId, productId }) => {
    await cartManager.addProductToCart(cartId, productId);
    const cart = await cartManager.getCartById(cartId);
    const cartProducts = cart.products;
    socket.emit("productsInCart", cartProducts);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}

module.exports = socketManager;
