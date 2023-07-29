const { Router } = require("express");
const ProductManager = require("../../managers/productManager");

const productManager = new ProductManager();
const router = Router();
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  const isAdminBoolean = req.user.role === "admin";
  res.render("realTimeProducts", {
    products,
    user: {
      ...req.user,
      isAdmin: isAdminBoolean,
    },
    jsFilename: "realTimeProducts",
    styleFilename: "realTimeProducts"
  });
});

module.exports = router;