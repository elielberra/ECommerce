const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const leanHook = require("./hooks/leanHook");

const cartSchema = new Schema({
  //   user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  user: { type: String, require: true },
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

// cartSchema.pre(["findOne", "find"], function (next) {
//   this.populate({
//     path: "products.product",
//     select: "title", 
//   });
//   next();
// });

const cartsModel = model("carts", cartSchema);

module.exports = cartsModel;
