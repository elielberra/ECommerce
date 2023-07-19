const { Router } = require("express");
const HomeRouter = require("./home/home.router");
const ProductsRouter = require("./api/products.router");
const CartsRouter = require("./api/carts.router");
const RealTimeProductsRouter = require("./realTimeProducts/realTimeProducts.router");

// Router for the home page
const homeRouter = Router();
homeRouter.use("/", HomeRouter);

// Router for the API
const apiRouter = Router();
apiRouter.use("/products", ProductsRouter);
apiRouter.use("/carts", CartsRouter);

// Router for the real time products page that uses Web Sockets
const realTimeProductsRouter = Router();
homeRouter.use("/realtimeproducts", RealTimeProductsRouter);

module.exports = {
  homeRouter,
  apiRouter,
  realTimeProductsRouter
};
