// Import dependencies
const http = require("http");
const path = require("path");
const express = require("express");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const session = require("express-session");
const { getMongoURI, connectToDatabase } = require("./utils");
const { homeRouter } = require("./routes");
const { apiRouter } = require("./routes");
const { chatRouter } = require("./routes");
const { productsRouterView } = require("./routes");
const { cartsRouterView } = require("./routes");
const { loginRouter } = require("./routes");
const { signupRouter } = require("./routes");
const socketHandler = require("./websocket");
const cartManager = require("./dao/managers/mongoDB/cartManager");

// Connect with MongoDB
connectToDatabase();

// Create express server
const app = express();

// Create Websocket
const server = http.createServer(app);
const io = new Server(server);
io.on("connection", socketHandler);

// Middleware for using the same socket on other routes
app.use((req, res, next) => {
  req.socket = io;
  next();
});

// Middlewares for parsing data
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

// Configure the engine for using handlebars templates
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Configure the public directory
const staticDir = path.join(__dirname, "..", "public");
app.use("/static", express.static(staticDir));

// Middleware for defaulting testing user with admin role and a hardcoded id
app.use((req, res, next) => {
  req.user = {
    id: "1",
    name: "Testing Admin User",
    role: "admin"
  };
  next();
});

// Middleware for setting a cartId
// Since there are no Users at this stage of the project, the Cart of the User with the  harcoded id 1 will be used
app.use(async (req, res, next) => {
  const userOfCart = req.user.id;
  const filter = { user: userOfCart };
  try {
    const cart = await cartManager.getCart(filter);
    if (cart) {
      req.cartId = cart._id;
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
  next();
});

// Middleware for using sessions
const sessionMins = 60;
const sessionSecs = 60;
app.use(
  session({
    secret: "ecommercesecret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: getMongoURI(),
      ttl: sessionMins * sessionSecs
    })
  })
);

// Handle routes
app.use("/", homeRouter);
app.use("/api", apiRouter);
app.use("/chat", chatRouter);
app.use("/products", productsRouterView);
app.use("/carts", cartsRouterView);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

// Configure Request listener of the Server
server.listen(
  process.env.SERVER_PORT,
  () =>
    process.env.VERBOSE && console.log(`Local server listening on port ${process.env.SERVER_PORT}`)
);
