const { Router } = require("express");
const ProductManager = require("../../managers/productManager");

const productManager = new ProductManager();
const router = Router();
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  const isAdminBoolean = req.user.role === "admin";
  res.render("home", {
    products,
    user: {
      ...req.user,
      isAdmin: isAdminBoolean,
    },
    jsFilename: "home",
    styleFilename: "home"
  });
});

module.exports = router;
