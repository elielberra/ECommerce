// Import dependencies
const http = require('http');
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const { connectToDatabase } = require('./utils');
const { homeRouter } = require('./routes');
const { apiRouter } = require('./routes');
const { chatRouter } = require('./routes');
const socketHandler = require('./websocket');

// Connect with MongoDB
connectToDatabase();

// Create express server
const app = express();

// Create Websocket
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', socketHandler);

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
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Configure the public directory
const staticDir = path.join(__dirname, '..', 'public');
app.use('/static', express.static(staticDir));

// Middleware for defaulting testing user with admin role
app.use((req, res, next) => {
    req.user = {
        id: 1,
        name: 'Testing Admin User',
        role: 'admin'
    };
    next();
});

// Handle routes
app.use('/', homeRouter);
app.use('/api', apiRouter);
app.use('/chat', chatRouter);

// Configure Request listener of the Server
server.listen(
    process.env.SERVER_PORT,
    () =>
        process.env.VERBOSE &&
        console.log(`Local server listening on port ${process.env.SERVER_PORT}`)
);
