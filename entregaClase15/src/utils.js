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

async function connectToDatabase() {
  let mongoURI = "";
  if (process.env.DB_ENVIRONMENT === "local") {
    mongoURI = `mongodb://localhost:${process.env.MONGO_LOCAL_PORT}/`;
  } else if (process.env.DB_ENVIRONMENT === "atlas") {
    const user = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;
    const clusterName = process.env.MONGO_CLUSTER_NAME;
    const clusterId = process.env.MONGO_CLUSTER_ID;
    const database = process.env.MONGO_DB;
    mongoURI = `mongodb+srv://${user}:${password}@${clusterName}.${clusterId}.mongodb.net/${database}?retryWrites=true&w=majority`;
  } else {
    throw new Error(`${process.env.DB_ENVIRONMENT} is not a valid environment`);
  }
  try {
    //  await mongoose.connect("mongodb://localhost:27017/")
    await mongoose.connect(mongoURI);
    console.log("You have connected to the Database");
  } catch (Error) {
    console.log("There was an error while trying to connect to the Database");
    throw Error;
  }
}

module.exports = { getRandomNumber, getRandomRoundNumber, connectToDatabase };
