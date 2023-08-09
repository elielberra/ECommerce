const { connectToDatabase } = require("../utils");

connectToDatabase();

async function deleteCollection(collection) {
  let dbOperationResult = "";
  if (collection === "products") {
    const productModel = require("../dao/models/productModel");
    dbOperationResult = await productModel.deleteMany({});
  } else if (collection === "chatmessages") {
    const messageModel = require("../dao/models/chatMessageModel");
    dbOperationResult = await messageModel.deleteMany({});
  } else if (collection === "carts") {
    const cartModel = require("../dao/models/cartModel");
    dbOperationResult = await cartModel.deleteMany({});
  } else {
    throw new Error(`${collection} is not a valid collection`);
  }
  console.log(
    `The result of trying to delete the collection ${collection} from MongoDB was`,
    dbOperationResult
  );
}

const collection = process.argv[2];
deleteCollection(collection);
