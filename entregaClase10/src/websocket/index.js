const ProductManager = require("../managers/productManager.js");
const CartManager = require("../managers/cartManager.js");
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

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("promo", async () => {
    const product = await productManager.getRandomProduct();
    socket.emit("promo", { title: product.title, sale: 15 });
  });

  socket.on("addToCart", async ({ cartId, productId }) => {
    await cartManager.addProductToCart(cartId, productId);
    const cart = await cartManager.getCartById(cartId);
    const cartProducts = cart.products
    console.log("CART products", cartProducts)
    socket.emit("productsInCart", cartProducts);
  });
}

module.exports = socketManager;
