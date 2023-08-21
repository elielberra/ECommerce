const { Schema, model } = require("mongoose");

const schema = new Schema({
  firstname: { type: String},
  lastname: { type: String},
  email: { type: String, index: true },
  password: { type: String},
  role: { type: String, default: "Customer" },
  gender: { type: String},
  age: { type: Number },
  createdDate: { type: Number, default: Date.now() }
});

const userModel = model("users", schema);

module.exports = userModel;
