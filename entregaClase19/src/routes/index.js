const { Router } = require("express");
const HomeRouter = require("./home/homeRouter");
const ProductsRouter = require("./api/productsRouter");
const CartsRouter = require("./api/cartsRouter");
const ChatRouter = require("./chat/chatRouter");
const ProductsRouterView = require("./productsView/productsRouterView");
const CartsRouterView = require("./cartsView/cartsRouterView");
const LoginRouter = require("./login/loginRouter");
const SignupRouter = require("./signup/signupRouter");
const LogoutRouter = require("./logout/logoutRouter");

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

// Router for the products
const productsRouterView = Router();
productsRouterView.use("/", ProductsRouterView);

// Router for the carts
const cartsRouterView = Router();
cartsRouterView.use("/", CartsRouterView);

// Router for the login
const loginRouter = Router();
loginRouter.use("/", LoginRouter);

// Router for signing up
const signupRouter = Router();
signupRouter.use("/", SignupRouter);

// Router for signing up
const logoutRouter = Router();
logoutRouter.use("/", LogoutRouter);

module.exports = {
  homeRouter,
  apiRouter,
  chatRouter,
  productsRouterView,
  cartsRouterView,
  loginRouter,
  signupRouter,
  logoutRouter
};
