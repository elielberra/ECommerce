const userManager = require("../dao/managers/mongoDB/userManager");

const githubAuthentication = async (accessToken, refreshToken, profile, done) => {
  try {
    const {
      _json: { name, email }
    } = profile;
    if (!email) {
      console.log("The user does not have his email set as public");
      return null, false;
    }
    let user = await userManager.getUserByEmail(email);
    if (!user) {
      console.log(`The user with the email${email} does not exist. It will be created`);
      const [firstname, lastname] = name.split(" ");
      const user = await userManager.createUser({
        firstname,
        lastname,
        email
      });
    } else {
      console.log(`The user with the email${email} already exists in the Database`);
    }
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error, false);
  }
};

module.exports = githubAuthentication;
