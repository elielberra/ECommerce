const fs = require("fs/promises");
const path = require("path");
const productsModel = require("../models/productModel");
const { connectToDatabase } = require("../utils");

connectToDatabase();

async function seed() {
  const filepath = path.join(__dirname, "..", "..", "data", "productsNoId.json");
  const data = await fs.readFile(filepath, "utf-8");
  const products = JSON.parse(data);
  const dbOperationResult = await productsModel.insertMany(products);
  console.log(
    "The result of trying to seed the initial load of the products to the MongoDB was",
    dbOperationResult
  );
}

seed();
