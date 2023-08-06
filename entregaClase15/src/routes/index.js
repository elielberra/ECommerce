const { Router } = require("express");
const HomeRouter = require("./home/homeRouter");
const ProductsRouter = require("./api/productsRouter");
const CartsRouter = require("./api/cartsRouter");
const ChatRouter = require("./chat/chatRouter");

// Router for the home page
const homeRouter = Router();
homeRouter.use("/", HomeRouter);

// Router for the API
const apiRouter = Router();
apiRouter.use("/products", ProductsRouter);
apiRouter.use("/carts", CartsRouter);

// Router for the chat
const chatRouter = Router();
chatRouter.use("/", ChatRouter);

module.exports = {
  homeRouter,
  apiRouter,
  chatRouter
};
