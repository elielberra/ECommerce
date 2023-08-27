const userManager = require("../dao/managers/mongoDB/userManager");
const { hashPassword, checkIfValidPassword } = require("../utils");

const localSignup = async (req, email, password, done) => {
  const { email: enteredEmail, password: enteredPassword, ...user } = req.body;
  try {
    const userFromDB = await userManager.getUserByEmail(enteredEmail);
    if (userFromDB) {
      console.log("The user already exists");
      return done(null, false);
    }
    const newUser = await userManager.createUser({
      ...user,
      email: enteredEmail,
      password: hashPassword(enteredPassword)
    });
    console.log("A new user has been created:", newUser);
    done(null, newUser)
  } catch (error) {
    console.error("An error has ocurred while trying to register the user");
    done(error, false);
  }
};

const localLogin = async (email, password, done) => {
  try {
    const userFromDB = await userManager.getUserByEmail(email);
    if (!userFromDB) {
      console.log("The user does not exist");
      return done(null, false);
    } else if (!password) {
      console.log("No password has been entered");
      return done(null, false);
    } else if (!checkIfValidPassword(password, userFromDB.password)) {
      console.log("Incorrect password entered");
      return done(null, false);
    }
    done(null, userFromDB);
  } catch (error) {
    console.error("An error has ocurred while trying to login a user");
    done(error, false);
  }
};

module.exports = {
  localSignup,
  localLogin
};
