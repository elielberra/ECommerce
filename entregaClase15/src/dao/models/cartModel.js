const { Schema, model } = require("mongoose");
const leanPreHook = require("./leanPreHook");

const schema = new Schema({
  //   user: { type: Schema.Types.ObjectId, ref: "users" },
  user: Number,
  products: {
    type: [
      {
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 0 },
      },
    ],
    default: [],
  },
  createdDate: { type: Number, default: Date.now() },
});

schema.pre(["findOne", "find"], leanPreHook);

const cartsModel = model("carts", schema);

module.exports = cartsModel;
