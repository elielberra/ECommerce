const ChatMessageManager = require("../dao/managers/mongoDB/chatMessageManager");

const chatMessageManager = new ChatMessageManager();

async function socketHandler(socket) {
  console.log(
    `A new connection has been established with this socket with the id: ${socket.id}`
  );

  const previousMessages = await chatMessageManager.getMessages();
  socket.emit("load-chat-messages", previousMessages);

  socket.on("disconnect", () => {
    console.log(`The connection with the id ${socket.id} has closed`);
  });

  socket.on("user-action", ({ user, action }) => {
    console.debug("user-action server side");
    socket.broadcast.emit("user-action-render", { user, action });
  });
}

module.exports = socketHandler;
