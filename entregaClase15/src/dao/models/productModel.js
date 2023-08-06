const { Schema, model } = require("mongoose");
const leanPreHook = require("./leanPreHook");

const schema = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: { type: Number, default: 0 },
  keywords: [String],
  thumbnail: { type: String, default: "No thumbnail available" },
  createdDate: { type: Number, default: Date.now() },
});

schema.pre(["findOne", "find"], leanPreHook);

const productsModel = model("products", schema);

module.exports = productsModel;
