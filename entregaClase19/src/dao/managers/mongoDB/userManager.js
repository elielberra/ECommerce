const userModel = require("../../models/userModel");
const cartManager = require("../../managers/mongoDB/cartManager");

class UserManager {
  async getUsers() {
    const users = await userModel.find({}).lean();
    return users;
  }

  async getUserById(id) {
    const user = await userModel.find({ _id: id }).lean();
    return user;
  }

  async getUserByEmail(enteredEmail) {
    const user = await userModel.findOne({ email: enteredEmail }).lean();
    console.debug("USER", user);
    return user;
  }

  async createUser(user) {
    const newUser = await userModel.create(user);
    console.debug("newUser", newUser);
    const newCart = await cartManager.addCart({ user: newUser._id });
    console.debug("newCart", newCart);
    await userModel.updateOne({ _id: newUser._id }, { $set: { cart: newCart._id } });
    const newUserWithCart = userModel.findOne({ _id: newUser._id });
    console.debug("newUserWithCart", newUserWithCart)
    return newUserWithCart;
  }

  async updateUser(id, user) {
    const existingUser = await this.getById(id);
    if (!existingUser) {
      return;
    }
    const { email, firstname, lastname, username, gender, age } = user;
    existingUser.email = email;
    existingUser.firstname = firstname;
    existingUser.lastname = lastname;
    existingUser.username = username;
    existingUser.gender = gender;
    existingUser.age = age;
    updatedUser = await existing.updateOne({ _id, existing: _id }, existingUser);
    return updatedUser;
  }

  async deleteUser(id) {
    const existingUser = await this.getById(id);
    if (!existingUser) {
      return;
    }
    await userModel.deleteOne({ _id: id });
  }
}

module.exports = new UserManager();
