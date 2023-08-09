const { Schema, model } = require("mongoose");
const leanHook = require("./hooks/leanHook");

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true, default: 0 },
  keywords:  { type: [String], required: true },
  thumbnail: { type: String, default: "No thumbnail available" },
  createdDate: { type: Number, default: Date.now() }
});

schema.pre(["findOne", "find"], leanHook);

const productsModel = model("products", schema);

module.exports = productsModel;
