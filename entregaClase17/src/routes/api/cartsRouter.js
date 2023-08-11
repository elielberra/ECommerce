const mongoose = require("mongoose");
const { Router } = require("express");
const cartManager = require("../../dao/managers/mongoDB/cartManager");
const { ItemNotFoundError } = require("../../errors");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).send(carts);
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid: cartId } = req.params;
  if (!mongoose.isValidObjectId(cartId)) {
    res.status(400).send("Please enter a valid ID with its proper format");
    return;
  }
  try {
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(404).send(`The cart with the ID ${cartId} was not found`);
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

router.post("/", async (req, res) => {
  const cart = req.body;
  try {
    const newCart = await cartManager.addCart(cart);
    res.status(200).send(`The cart was successfully created.\n${JSON.stringify(newCart)}`);
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

// Add product to cart
router.put("/:cid/product/:pid", async (req, res) => {
  const { cid: cartId, pid: productId } = req.params;
  for (const id of [cartId, productId]) {
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).send("Please enter a valid ID with its proper format");
      return;
    }
  }
  try {
    const cartModified = await cartManager.addProductToCart(cartId, productId);
    if (cartModified) {
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

// Update the quantity of a product
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid: cartId, pid: productId } = req.params;
  for (const id of [cartId, productId]) {
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).send("Please enter a valid ID with its proper format");
      return;
    }
  }
  for (const id of [cartId, productId]) {
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).send("Please enter a valid ID with its proper format");
      return;
    }
  }
  let { quantity: newQuantity} = req.body;
  console.log("newQuantity", newQuantity);
  if (!newQuantity) {
    res.status(400).send("Insert on the body of the Request the new quantity" +
                        "The format is '{\"quantity\": num}' and num must be a number  equal or higher than 1");
    return;
  }
  newQuantity = parseInt(newQuantity);
  if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
    res.status(400).send(`Enter a valid quantity, it should be a number equal or higher than 1`);
    return;
  }
  try {
    await cartManager.updateProductQuantity(cartId, productId, newQuantity);
    res.status(200).send("The product's quantity was successfully updated");
    return;
  } catch (error) {
    if (error instanceof ItemNotFoundError) {
      res.status(404).send(error.message);
      return;
    } else {
      res.status(500).send(`There was been an error with the server.\n${error}`);
    }
  }
});

// Delete cart
router.delete("/:cid", async (req, res) => {
  const { cid: cartId } = req.params;
  if (!mongoose.isValidObjectId(cartId)) {
    res.status(400).send("Please enter a valid ID with its proper format");
    return;
  }
  try {
    const dbOperationResult = await cartManager.deleteCart(cartId);
    if (dbOperationResult.deletedCount >= 1) {
      res.status(200).send("The cart was deleted successfully.");
      return;
    } else {
      res
        .status(404)
        .send(`No matching cart was found with the ID ${cartId}. It can't be modified`);
      return;
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

// Delete product from cart
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid: cartId, pid: productId } = req.params;
  for (const id of [cartId, productId]) {
    if (!mongoose.isValidObjectId(id)) {
      res
        .status(400)
        .send(`The ID ${id} is invalid. Please enter a valid ID with its proper format`);
      return;
    }
  }
  try {
    await cartManager.deleteProductFromCart(cartId, productId);
    res.status(200).send("The product was successfully deleted from the cart");
    return;
  } catch (error) {
    if (error instanceof ItemNotFoundError) {
      res.status(404).send(error.message);
      return;
    } else {
      res.status(500).send(`There was been an error with the server.\n${error}`);
    }
  }
});

module.exports = router;
