const passport = require("passport");
const localPassport = require("passport-local");
const GithubStrategy = require("passport-github2");
const userManager = require("../dao/managers/mongoDB/userManager");
const { localSignup, localLogin } = require("./localPassportConfig");
const githubAuthentication = require("./githubPassportConfig");
const env = process.env;

const LocalStrategy = localPassport.Strategy;

const initializePassport = () => {
  passport.use(
    "local-signup",
    new LocalStrategy({ usernameField: "email", passReqToCallback: true }, localSignup)
  );
  passport.use("local-login", new LocalStrategy({ usernameField: "email" }, localLogin));

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackUrl: env.GITHUB_CALLBACK_URL
      },
      githubAuthentication
    )
  );

  passport.serializeUser((user, done) => {
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
