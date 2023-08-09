const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const leanHook = require("./hooks/leanHook");

const chatMessageSchema = new Schema({
  user: String,
  message: String,
  datetime: String
});

chatMessageSchema.pre(["findOne", "find"], leanHook);
chatMessageSchema.plugin(mongoosePaginate);

const chatMessagesModel = model("chatmessages", chatMessageSchema);

module.exports = chatMessagesModel;
