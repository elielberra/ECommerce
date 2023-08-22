const { Router } = require("express");
const chatMessageManager = require("../../dao/managers/mongoDB/chatMessageManager");
const cartManager = require("../../dao/managers/mongoDB/cartManager");

const router = Router();
router.get("/", async (req, res) => {
  const isAdminBoolean = req.session?.user.role === "admin";
  if (req.session.user) {
    const cart = await cartManager.getCartById(req.session.user.cart);
    numProductsInCart = cart?.products.length;
  }
  const messages = await chatMessageManager.getMessages();
  res.render("chat", {
    messages: messages,
    user: req.session.user
    ? {
        ...req.session.user,
        isAdmin: isAdminBoolean
      }
    : null,
    numProductsInCart: numProductsInCart ? numProductsInCart : 0,
    jsFilename: "chat",
    styleFilename: "chat",
    loadSweetAlert: true
  });
});

router.post("/new-message", async (req, res) => {
  const { body: message } = req;
  try {
    const newProduct = await chatMessageManager.addMessage(message);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;
