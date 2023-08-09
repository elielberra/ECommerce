const mongoose = require("mongoose");
const { Router } = require("express");
const cartManager = require("../../dao/managers/mongoDB/cartManager");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).send(carts);
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
    const cart = await cartManager.getCartById(id);
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(404).send(`The cart with the ID ${id} was not found`);
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.post("/", async (req, res) => {
  const cart = req.body;
  try {
    const newCart = await cartManager.addCart(cart);
    res
      .status(200)
      .send(
        `The cart was successfully created.\n${JSON.stringify(newCart)}`
      );
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  for (const id of [cartId, productId]){
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).send("Please enter a valid ID with its proper format");
      return;
    }
  }
  try {
    const dbOperationResult = await cartManager.addProductToCart(cartId, productId);
    if (dbOperationResult.matchedCount >= 1) {
      res.status(200).send("The product was added successfully to the cart");
      return;
    } else {
      res
        .status(404)
        .send(
          `No matching product or cart was found (cart ID: ${cartId} --  product ID: ${productId}). It was not modified`
        );
      return;
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Please enter a valid ID with its proper format");
    return;
  }
  try {
    const dbOperationResult = await cartManager.deleteCart(id);
    if (dbOperationResult.deletedCount >= 1) {
      res.status(200).send("The cart was deleted successfully.");
      return;
    } else {
      res
        .status(404)
        .send(
          `No matching cart was found with the ID ${id}. It can't be modified`
        );
      return;
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

module.exports = router;
