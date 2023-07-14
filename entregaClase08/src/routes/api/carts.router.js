const { Router } = require("express");
const CartsManager = require("../../managers/cartsManager");

const cartsManager = new CartsManager();
const router = Router();

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const cart = await cartsManager.getCartById(id);
  if (cart) {
    res.send(cart);
  } else {
    res.status(404);
    res.send(`The cart with the ID ${id} was not found.`);
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.addCart();
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

router.use("/:cid/product/:pid", async (req, res) => {
  console.log("INSIDE ADD CID PID");
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const updatedCart = await cartsManager.addProductToCart(cartId, productId);
  if (updatedCart) {
    res
      .status(200)
      .send(
        `The product was successfully added to the cart.`
      );
  } else {
    res.status(404);
    res.send(`Please enter a valid cart ID and / or a valid product ID.`);
  }
});

module.exports = router;
