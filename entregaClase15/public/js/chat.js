const messages = document.querySelector("#messages");
messages.innerHTML = "";
const input = document.querySelector("#user_input");
const sendMessage = document.querySelector("#send_message");

const appendUserAction = (user, action) => {
  const div = document.createElement("div");
  div.classList.add("user_action");
  div.innerHTML = `<span class="${action}">${user} has ${action} the chatroom</span>`;
  messages.appendChild(div);
  setTimeout(() => {
    messages.scrollTo(0, messages.scrollHeight);
  }, 250);
};

const appendMessage = (user, datetime, message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<span class="message_user">${datetime} - ${user}</span>
                   <span class="message_text">${message}</span>`;
  messages.appendChild(div);
  setTimeout(() => {
    messages.scrollTo(0, messages.scrollHeight);
  }, 250);
};

function messageSentHandler(event) {
  if (event.key !== "Enter" && event.type !== "click") {
    return;
  }
  const username = socket.username;
  const userInput = document.getElementById("user_input");
  const messageText = userInput.value;
  const datetime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const message = {
    user: username,
    datetime,
    message: messageText
  };
  socket.emit("new-message", message);
  userInput.value = "";
  appendMessage(username, datetime, messageText);
}

const socket = io();
socket.on("load-chat-messages", messagesList => {
  previousMessages = messagesList;
});
socket.on("user-action-render", ({ user, action }) => {
  appendUserAction(user, action);
});
socket.on("new-message-render", ({ user, datetime, message }) => {
  appendMessage(user, datetime, message);
});
socket.on("disconnect", () => {
  process.env.VERBOSE && console.log("Disconnecting from the socket on the client side");
});

let previousMessages = [];
Swal.fire({
  title: "Enter your username",
  input: "text",
  inputAttributes: {
    autocapitalize: "off"
  },
  confirmButtonText: "Send",
  allowOutsideClick: false,
  preConfirm: username => {
    if (!username) {
      Swal.showValidationMessage("The username cannot be blank");
      return;
    }
    return username;
  }
}).then(({ value }) => {
  const username = value;
  socket.username = username;

  socket.emit("user-action", { user: username, action: "joined" });
  for (const { user, datetime, message } of previousMessages) {
    appendMessage(user, datetime, message);
  }
  input.addEventListener("keyup", messageSentHandler);
  sendMessage.addEventListener("click", messageSentHandler);
});
