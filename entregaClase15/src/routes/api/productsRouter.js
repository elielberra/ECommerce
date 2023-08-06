const { Router } = require("express");
const mongoose = require("mongoose");
const ProductManager = require("../../dao/managers/mongoDB/productManager");
const productsModel = require("../../dao/models/productModel");

const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  console.log("Retrieving products");
  products = await productManager.getProducts();
  const { limit } = req.query;
  if (limit) {
    products = products.slice(0, limit);
  }
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (mongoose.isValidObjectId(id)) {
    const product = await productManager.getProductById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404);
      res.send(`The product with the ID ${id} was not found.`);
    }
  } else {
    console.log(
      `Invalid ObjectId format. Received ID: ${id}  -- Of type ${typeof id}`
    );
    res.status(500).send(`The product with the ID ${id} was not found.`);
  }
});

router.post("/", async (req, res) => {
  const { body: product } = req;
  try {
    const newProduct = await productManager.addProduct(product);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { body: product } = req;
  const { id } = req.params;
  try {
    const dbOperationResult = await productManager.updateProduct(id, product);
    if (dbOperationResult.matchedCount >= 1) {
      res.status(200).send("The product was updated successfully.");
      return;
    } else {
      res
        .status(404)
        .send(
          `No matching product was found with the ID ${id}. It can't be modified.`
        );
      return;
    }
  } catch (error) {
    res.status(500).send({
      message:
        "There was been an error with the server. Please try again later.",
      exception: error.stack,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbOperationResult = await productManager.deleteProduct(id);
    if (dbOperationResult.deletedCount >= 1) {
      res.status(200).send("The product was deleted successfully.");
      return;
    } else {
      res
        .status(404)
        .send(
          `No matching product was found with the ID ${id}. It can't be modified.`
        );
      return;
    }
  } catch (error) {
    res.status(500).send({
      message:
        "There was been an error with the server. Please try again later.",
      exception: error.stack,
    });
  }
});

module.exports = router;
