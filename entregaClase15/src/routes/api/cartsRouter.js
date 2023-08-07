const { Router } = require("express");
const cartManager = require("../../dao/managers/mongoDB/cartManager");

const router = Router();

router.get("/", async (req, res) => {
  console.log("Retrieving carts");
  const carts = await cartManager.getCarts();
  res.send(carts);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const cart = await cartManager.getCartById(id);
  if (cart) {
    res.send(cart);
  } else {
    res.status(404);
    res.send(`The cart with the ID ${id} was not found.`);
  }
});

router.post("/", async (req, res) => {
  const cart = req.body;
  try {
    const newCart = await cartManager.addCart(cart);
    res
      .status(200)
      .send(
        `The cart was successfully created. It contains the ID ${newCart.id}`
      );
  } catch (error) {
    res.status(500).send({
      message:
        "There was been an error with the server. Please try again later.",
      exception: error.stack,
    });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const updatedCart = await cartManager.addProductToCart(cartId, productId);
  if (updatedCart) {
    res.status(200).send(`The product was successfully added to the cart.`);
  } else {
    res.status(404);
    res.send(`Please enter a valid cart ID and / or a valid product ID.`);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dbOperationResult = await cartManager.deleteCart(id);
    if (dbOperationResult.deletedCount >= 1) {
      res.status(200).send("The cart was deleted successfully.");
      return;
    } else {
      res
        .status(404)
        .send(
          `No matching cart was found with the ID ${id}. It can't be modified.`
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
