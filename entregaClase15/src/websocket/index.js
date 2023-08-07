const chatMessageManager = require("../dao/managers/mongoDB/chatMessageManager");

async function socketHandler(socket) {
  console.log(
    `A new connection has been established with this socket with the id: ${socket.id}`
  );

  const previousMessages = await chatMessageManager.getMessages();
  socket.emit("load-chat-messages", previousMessages);

  socket.on("user-action", ({ user, action }) => {
    console.debug("user-action server side", action);
    if (action === "joined") {
        socket.user = user
    }
    socket.broadcast.emit("user-action-render", { user, action });
  });

  socket.on("new-message", async (message) => {
    console.debug("MESSAGE", message);
    await chatMessageManager.addMessage(message);
    socket.broadcast.emit('new-message-render', message)
  });

  socket.on("disconnect", () => {
    console.log(`The connection with the id ${socket.id} has closed`);
    socket.broadcast.emit("user-action-render", { user: socket.user, action: "exited" });
  });
}

module.exports = socketHandler;
