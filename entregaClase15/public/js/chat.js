const messages = document.querySelector("#messages");
messages.innerHTML = "";
const input = document.querySelector("#user_input");

const appendUserAction = (user, action) => {
  const div = document.createElement("div");
  div.classList.add("user_action");
  div.innerHTML = `<span class="${action}">${user} has ${action} the chatroom</span>`;
  messages.appendChild(div);
  setTimeout(() => {
    messages.scrollTo(0, messages.scrollHeight);
  }, 250);
};

const socket = io();
socket.on("user-action-render", ({ user, action }) => {
  appendUserAction(user, action);
});

const appendMessage = (user, time, message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<span class="message_user">${user}</span>
                   <span class="message_text">${message}</span>`;

  messages.appendChild(div);

  // encierro en un set timeout
  // para que la altura del contenedor se actualice
  // con el nuevo nodo
  setTimeout(() => {
    messages.scrollTo(0, messages.scrollHeight);
  }, 250);
};

// logica

// let username = null;
let previousMessages = [];

socket.on("load-chat-messages", (messagesList) => {
  previousMessages = messagesList;
});

Swal.fire({
  title: "Enter your username",
  input: "text",
  inputAttributes: {
    autocapitalize: "off"
  },
  confirmButtonText: "Send",
  allowOutsideClick: false,
  preConfirm: (username) => {
    if (!username) {
      Swal.showValidationMessage("The username cannot be blank");
      return;
    }
    return username;
  }
}).then(({ value }) => {
  const username = value;
  console.debug("before emmit user-action signal");
  socket.emit("user-action", { user: username, action: "joined" });

  for (const { user, datetime, message } of previousMessages) {
    appendMessage(user, datetime, message);
  }
  socket.on("chat-message", ({ user, datetime, message }) => {
    appendMessage(user, datetime, message);
  });
  input.addEventListener("keyup", ({ key, target }) => {
    if (key !== "Enter") {
      return;
    }
    const { value } = target;
    if (!value) {
      return;
    }
    // enviar el mensaje al socket
    const fecha = new Date();
    const msg = {
      user: username,
      datetime: fecha.toLocaleTimeString("en-US"),
      text: value
    };
    socket.emit("chat-message", msg);
    target.value = "";
    appendMessage(username, fecha.toLocaleTimeString("en-US"), value);
  });
});
