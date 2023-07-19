// Import dependencies
const express = require("express");
const http = require("http");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const { homeRouter } = require("./src/routes");
const { apiRouter } = require("./src/routes");
const { realTimeProductsRouter } = require("./src/routes");

const app = express();

// Create Websocket
const server = http.createServer(app);
const io = new Server(server);
const socketManager = require("./src/websocket");
io.on("connection", socketManager);
// Middleware for using the same socket on other routes
app.use((req, res, next) => {
  req.socket = io;
  next();
});

// Middlewares for parsing data
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Configure the engine for using handlebars templates
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

// Configure the public directory
const staticDir = path.join(__dirname, "public");
app.use("/static", express.static(staticDir));

// Create a testing user with admin role
app.use((req, res, next) => {
  req.user = {
    name: "Testing Admin User",
    role: "admin",
  };
  next();
});

// Handle routes
app.use("/", homeRouter);
app.use("/api", apiRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

// Configure Request listener of the Server
port = 8080;
server.listen(port, () =>
  console.log(`Local server listening on port ${port}`)
);
