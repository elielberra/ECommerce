const { Router } = require("express");
const userManager = require("../../dao/managers/mongoDB/userManager");

const router = Router();
router.get("/", (_, res) =>
  res.render("signup", {
    styleFilename: "login-signup"
  })
);
router.post("/", async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await userManager.getUserByEmail(user.email);
    if (existingUser) {
      return res.render("signup", {
        styleFilename: "login-signup",
        error: "That email is already registered"
      });
    }
    if (user.password !== user.passwordRepeated ) {
        return res.render("signup", {
            styleFilename: "login-signup",
            error: "The two passwords must be the same"
          });
    }
    const newUser = await userManager.createUser(user);
    req.session.user = {
      ...newUser._doc
    };
    console.log("REQ.SESSIONS", req.session)
    // console.log(req.session);
    req.session.save((err) => {
      res.redirect("/products");
    });
  } catch (error) {
    console.error(error);
    return res.render("signup", {
      error: "There has been an error with the server. Please try again later"
    });
  }
});

module.exports = router;
