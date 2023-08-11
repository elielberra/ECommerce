const { Router } = require("express");
const mongoose = require("mongoose");
const productManager = require("../../dao/managers/mongoDB/productManager");
const { ProductsCodeExistsError } = require("../../errors");

const router = Router();

router.get("/", async (req, res) => {
  let { limit } = req.query;
  if (limit) {
    limit = parseInt(limit);
    if (!Number.isInteger(limit) || limit < 1) {
      res
        .status(400)
        .send(
          "The limit query parameter is invalid. It should be an integer number equal or higher than 1"
        );
      return;
    }
  }
  try {
    let products = await productManager.getProducts(limit ? limit : 0);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Please enter a valid ID with its proper format");
    return;
  }
  try {
    const product = await productManager.getProductById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send(`The product with the ID ${id} was not found`);
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.post("/", async (req, res) => {
  const { body: product } = req;
  try {
    const newProduct = await productManager.addProduct(product);
    res.status(201).send(`The product was succesfully created.\n${JSON.stringify(newProduct)}`);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send(`The product needs all of its required fields to be created.\n${error}`);
    } else if (error instanceof ProductsCodeExistsError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(`There was been an error with the server.\n${error}`);
    }
  }
});

router.put("/:id", async (req, res) => {
  const { body: product } = req;
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Please enter a valid ID with its proper format");
    return;
  }
  try {
    const dbOperationResult = await productManager.updateProduct(id, product);
    if (dbOperationResult.matchedCount >= 1) {
      res.status(200).send("The product was updated successfully");
      return;
    } else {
      res.status(404).send(`No matching product was found with the ID ${id}. It was not modified`);
      return;
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbOperationResult = await productManager.deleteProduct(id);
    if (dbOperationResult.deletedCount >= 1) {
      res.status(200).send("The product was deleted successfully");
      return;
    } else {
      res.status(404).send(`No matching product was found with the ID ${id}. It cannot be deleted`);
      return;
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

module.exports = router;
