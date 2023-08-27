const passport = require("passport");
const { Router } = require("express");

const router = Router();
router.get("/", (_, res) =>
  res.render("signup", {
    styleFilename: "login-signup"
  })
);
router.post(
  "/",
  passport.authenticate("local-signup", {
    successRedirect: "/products",
    failureRedirect: "/signup"
  })
);

module.exports = router;
