const mongoose = require("mongoose");
const { Router } = require("express");
const cartManager = require("../../dao/managers/mongoDB/cartManager");

const router = Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send("Please enter a valid ID with its proper format");
    return;
  }
  try {
    const cart = await cartManager.getCartById(id);
    if (cart) {
      const isAdminBoolean = req.user.role === "admin";
      // const cart = await cartManager.getCartById(req.cartId).populate({
      //   path: "products.product",
      //   select: "title"
      // });
      const cart = await cartManager.getCartById(req.cartId);
      // console.log("cart", cart)
      const productsInCart = cart.products;
      console.log("productsInCart", productsInCart)
      const numProductsInCart = cart.products.length;
      res.render("productsInCart", {
        productsInCart,
        user: {
          ...req.user,
          isAdmin: isAdminBoolean
        },
        jsFilename: "",
        styleFilename: "products",
        cartId: req.cartId,
        numProductsInCart
      });
    } else {
      res.status(404).send(`The cart with the ID ${id} was not found`);
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
  }
});

module.exports = router;
