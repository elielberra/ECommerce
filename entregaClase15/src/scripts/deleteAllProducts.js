const fs = require("fs/promises");
const mongoose = require("mongoose");
const productsModel = require("../models/product.model");
const { connectToDatabase } = require("../utils");

connectToDatabase();

async function deleteAllProducts() {
  const dbOperationResult = await productsModel.deleteMany({});
  console.log(
    "The result of trying to delete all the products from MongoDB was",
    dbOperationResult
  );
}

deleteAllProducts();
