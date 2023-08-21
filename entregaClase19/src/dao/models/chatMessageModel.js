const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const chatMessageSchema = new Schema({
  user: String,
  message: String,
  datetime: String
});

chatMessageSchema.plugin(mongoosePaginate);

const chatMessagesModel = model("chatmessages", chatMessageSchema);

module.exports = chatMessagesModel;
