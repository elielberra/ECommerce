const { Router } = require("express");
const userManager = require("../../dao/managers/mongoDB/userManager");

const router = Router();
router.get("/", (_, res) =>
  res.render("login", {
    styleFilename: "login-signup"
  })
);
router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      return res.render("login", { error: "El usuario no existe" });
    }
    req.session.user = {
      name: user.firstname,
      id: user._id,

      // role: 'Admin'
      ...user
    };
    req.session.save((err) => {
      if (!err) {
        res.redirect("/");
      }
    });
  } catch (e) {
    res.render("login", { error: "Ha ocurrido un error" });
  }
  // guardo la session con la informacion del usuario
});

module.exports = router;
