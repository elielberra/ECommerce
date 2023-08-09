const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const leanHook = require("./hooks/leanHook");

const cartSchema = new Schema({
  //   user: { type: Schema.Types.ObjectId, ref: "users" },
  user: Number,
  products: {
    type: [
      {
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 0 }
      }
    ],
    default: []
  },
  createdDate: { type: Number, default: Date.now() }
});

cartSchema.pre(["findOne", "find"], leanHook);
cartSchema.plugin(mongoosePaginate);

const cartsModel = model("carts", cartSchema);

module.exports = cartsModel;
