const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  keywords: { type: [String], required: true },
  thumbnail: { type: String, default: "No thumbnail available" },
  createdDate: { type: Number, default: Date.now() }
});

productSchema.plugin(mongoosePaginate);

const productsModel = model("products", productSchema);

module.exports = productsModel;
