const mongoose = require("mongoose");
const userManager = require("../dao/managers/mongoDB/userManager");
const { connectToDatabase } = require("../utils");

async function addAdminUser() {
  connectToDatabase();
  console.log("Creating the Admin user");
  const userData = {
    firstname: "Coder",
    lastname: "Admin",
    email: "adminCoder@coder.com",
    password: "adminCod3r123",
    role: "Admin",
    gender: "Male",
    age: 30
  };
  try {
    const newUser = await userManager.createUser(userData);
    console.log("The Admin user was created successfully");
  } catch (error) {
    console.error("There was an errro while trying to create the Admin user", error);
  } finally {
    mongoose.connection.close();
  }
}

addAdminUser();
