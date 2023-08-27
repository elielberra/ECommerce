// Import dependencies
const http = require("http");
const path = require("path");
const express = require("express");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const { getMongoURI, connectToDatabase } = require("./utils");
const { homeRouter } = require("./routes");
const { apiRouter } = require("./routes");
const { chatRouter } = require("./routes");
const { productsRouterView } = require("./routes");
const { cartsRouterView } = require("./routes");
const { loginRouter } = require("./routes");
const { signupRouter } = require("./routes");
const { logoutRouter } = require("./routes");
const socketHandler = require("./websocket");
const initializePassport = require("./config/passportGlobal");

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

// Passport Middlewares
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Handle routes
app.use("/", homeRouter);
app.use("/api", apiRouter);
app.use("/chat", chatRouter);
app.use("/products", productsRouterView);
app.use("/carts", cartsRouterView);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);

// Configure Request listener of the Server
server.listen(
  process.env.SERVER_PORT,
  () =>
    process.env.VERBOSE && console.log(`Local server listening on port ${process.env.SERVER_PORT}`)
);
