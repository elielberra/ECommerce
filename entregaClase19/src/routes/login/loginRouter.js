const { Router } = require("express");
const userManager = require("../../dao/managers/mongoDB/userManager");

const router = Router();
router.get("/", (_, res) =>
  res.render("login", {
    styleFilename: "login-signup"
  })
);
router.post("/", async (req, res) => {
  console.debug("REQ.BODY", req.body);
  const { email } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      return res.render("login", {
        styleFilename: "login-signup",
        error: "El usuario no existe"
      });
    }
    req.session.user = user;
    req.session.save((error) => {
      if (!error) {
        res.redirect("/products");
      }
    });
  } catch (error) {
    console.error(error);
    return res.render("login", {
      error: "There has been an error with the server. Please try again later"
    });
  }
});

module.exports = router;
