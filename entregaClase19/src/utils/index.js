const mongoose = require("mongoose");
require("dotenv").config();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRoundNumber(min, max) {
  const range = max - min + 1;
  const randomOffset = Math.floor(Math.random() * range);
  const roundedNumber = Math.floor((min + randomOffset) / 5) * 5;
  return roundedNumber;
}

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

async function connectToDatabase() {
  const mongoURI = getMongoURI();
  try {
    await mongoose.connect(mongoURI);
    process.env.VERBOSE &&
      console.log(`You have connected to the ${process.env.DB_ENVIRONMENT} Database`);
  } catch (error) {
    console.error("There was an error while trying to connect to the Database");
    throw error;
  }
}

module.exports = { getRandomNumber, getRandomRoundNumber, getMongoURI, connectToDatabase };
