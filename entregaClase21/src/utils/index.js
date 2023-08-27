const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

function getMongoURI() {
  let mongoURI = "";
  if (process.env.DB_ENVIRONMENT === "local") {
    mongoURI = `mongodb://localhost:${process.env.MONGO_LOCAL_PORT}/${process.env.MONGO_DB}`;
  } else if (process.env.DB_ENVIRONMENT === "atlas") {
    mongoURI =
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
      `@${process.env.MONGO_CLUSTER_NAME}.${process.env.MONGO_CLUSTER_ID}` +
      `.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
  } else {
    throw new Error(`${process.env.DB_ENVIRONMENT} is not a valid environment`);
  }
  return mongoURI;
}

const connectToDatabase = async () => {
  const mongoURI = getMongoURI();
  try {
    await mongoose.connect(mongoURI);
    process.env.VERBOSE &&
      console.log(`You have connected to the ${process.env.DB_ENVIRONMENT} Database`);
  } catch (error) {
    console.error("There was an error while trying to connect to the Database");
    throw error;
  }
};

const hashPassword = (password) => {
  if (!password) {
    throw new Error("No password has been entered")
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const checkIfValidPassword = (enteredPassword, userPassword) => {
  if (!enteredPassword || !userPassword) {
    throw new Error("No password has been entered")
  }
  return bcrypt.compareSync(enteredPassword, userPassword);
};

module.exports = { getMongoURI, connectToDatabase, hashPassword, checkIfValidPassword };
