const mongoose = require("mongoose");

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
    try {
      //  await mongoose.connect("mongodb://localhost:27017/")
      await mongoose.connect(
        "mongodb+srv://App:9GzdKAD66G7At9dp@ecommercecodercluster.w4doywi.mongodb.net/?retryWrites=true&w=majority"
      );
      console.log("You have connected to the Database");
    } catch (Error) {
      console.log("There was an error while trying to connect to the Database");
      throw Error;
    }
}

module.exports = { getRandomNumber, getRandomRoundNumber, connectToDatabase };
