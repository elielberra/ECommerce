const passport = require("passport");
const { Router } = require("express");

const router = Router();
router.get("/", (_, res) =>
  res.render("login", {
    styleFilename: "login-signup"
  })
);
router.post(
  "/",
  passport.authenticate("local-login", {
    successRedirect: "/products",
    failureRedirect: "/login"
  })
);

router.get(
  "/github",
  passport.authenticate("github", {
    successRedirect: "/products",
    failureRedirect: "/login"
  }),
  async (req, res) => {
    console.log("INSIDE GITHUB INTIAL AUTHENTICATION");
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/products",
    failureRedirect: "/login"
  })
);
module.exports = router;
