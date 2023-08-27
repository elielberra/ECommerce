const passport = require("passport");
const localPassport = require("passport-local");
const userManager = require("../dao/managers/mongoDB/userManager");
const { localSignup, localLogin } = require("./localPassportConfig");

const LocalStrategy = localPassport.Strategy;

const initializePassport = () => {
  passport.use(
    "local-signup",
    new LocalStrategy({ usernameField: "email", passReqToCallback: true }, localSignup)
  );
  passport.use("local-login", new LocalStrategy({ usernameField: "email" }, localLogin));
  passport.serializeUser((user, done) => {
    console.debug("SERIALIZING USER:", user);
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userManager.getUserById(id);
      done(null, user);
    } catch (error) {
      console.error("There has been an error while trying to deserialize a user with the id:", id);
      done(error, false);
    }
  });
};

module.exports = initializePassport;
