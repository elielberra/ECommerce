const { Schema, model } = require("mongoose");

const schema = new Schema({
  user: String,
  messages: String
});

const chatMessagesModel = model("chatMessages", schema);

module.exports = chatMessagesModel;
