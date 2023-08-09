const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const leanHook = require("./hooks/leanHook");

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true, default: 0 },
  keywords: { type: [String], required: true },
  thumbnail: { type: String, default: "No thumbnail available" },
  createdDate: { type: Number, default: Date.now() }
});

productSchema.pre(["findOne", "find"], leanHook);
productSchema.plugin(mongoosePaginate);

const productsModel = model("products", productSchema);

module.exports = productsModel;
