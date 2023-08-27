const passport = require("passport");
const { Router } = require("express");

const router = Router();
router.get("/", (_, res) =>
  res.render("login", {
    styleFilename: "login-signup"
  })
);
router.post("/", passport.authenticate("local-login", {
  successRedirect: "/products",
  failureRedirect: "/login"
}));

module.exports = router;
