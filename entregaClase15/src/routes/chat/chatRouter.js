const { Router } = require("express");
const chatManager = require("../../dao/managers/mongoDB/chatMessageManager");

const router = Router();
router.get("/", async (req, res) => {
  const isAdminBoolean = req.user.role === "admin";
  res.render("chat", {
    user: {
      ...req.user,
      isAdmin: isAdminBoolean
    },
    jsFilename: "chat",
    styleFilename: "chat"
  });
});

module.exports = router;
