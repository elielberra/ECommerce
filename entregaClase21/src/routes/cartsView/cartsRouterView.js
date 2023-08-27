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
    const cart = await cartManager.getCartById(id, true);
    if (cart) {
      const isAdminBoolean = req.user?.role === "admin";
      const productsInCart = cart.products;
      const numProductsInCart = cart.products?.length;
      res.render("productsInCart", {
        user: req.user
          ? {
              ...req.user,
              isAdmin: isAdminBoolean
            }
          : null,
        jsFilename: "productsInCart",
        styleFilename: "products",
        productsInCart,
        numProductsInCart: numProductsInCart ? numProductsInCart : 0
      });
    } else {
      res.status(404).send(`The cart with the ID ${id} was not found`);
    }
  } catch (error) {
    res.status(500).send(`There was been an error with the server.\n${error}`);
    throw error;
  }
});

module.exports = router;
