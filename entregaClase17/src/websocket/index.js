const chatMessageManager = require("../dao/managers/mongoDB/chatMessageManager");
const cartManager = require("../dao/managers/mongoDB/cartManager");

async function socketHandler(socket) {
  process.env.VERBOSE &&
    console.log(`A new connection has been established with this socket with the id: ${socket.id}`);

  const previousMessages = await chatMessageManager.getMessages();
  socket.emit("load-chat-messages", previousMessages);

  socket.on("user-action", ({ user, action }) => {
    if (action === "joined") {
      socket.user = user;
    }
    socket.broadcast.emit("user-action-render", { user, action });
  });

  socket.on("new-message", async message => {
    await chatMessageManager.addMessage(message);
    socket.broadcast.emit("new-message-render", message);
  });

  socket.on("product-added-to-cart", async ({ cartId, productId }) => {
    await cartManager.addProductToCart(cartId, productId);
    const cart = await cartManager.getCartById(cartId);
    const numProductsInCart = cart.products.length;
    socket.emit("update-cart-badge", numProductsInCart);
  });

  socket.on("disconnect", () => {
    process.env.VERBOSE && console.log(`The connection with the id ${socket.id} has closed`);
    socket.broadcast.emit("user-action-render", {
      user: socket.user,
      action: "exited"
    });
  });
}

module.exports = socketHandler;
