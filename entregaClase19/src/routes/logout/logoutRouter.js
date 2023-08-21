const { Router } = require("express");

const router = Router();
router.get("/", (req, res) => {
    console.debug(req.session)
  res.render("logout", {
    styleFilename: "logout",
    a: "AAA",
    userFirstName: req.session.user.firstname
  });
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.send("There has been an error with the server. Please try again later");
    }
  });
});

module.exports = router;
