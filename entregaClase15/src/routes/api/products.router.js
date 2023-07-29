const { Router } = require("express");
const mongoose = require("mongoose");
const ProductManager = require("../../managers/productManager");
const productsModel = require("../../models/product.model");

const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  console.log("Retrieving products");
  products = await productManager.getProducts();
  const { limit } = req.query;
  if (limit) {
    products = products.slice(0, limit);
  }
  res.send(products);
});

router.get("/:id", async (req, res) => {
  // const id = parseInt(req.params.id) ;
  // const product = await productManager.getProductById(id);
  const id = req.params.id;
  console.log(typeof id);
  if (mongoose.isValidObjectId(id)) {
    const product = await productsModel.findOne({ _id: id });
    if (product) {
      res.send(product);
    } else {
      res.status(404);
      res.send(`The product with the ID ${id} was not found.`);
    }
  } else {
    console.log(
      `Invalid ObjectId format. Received ID: ${id}  -- Of type ${typeof id}`
    );
    res.status(500).send(`The product with the ID ${id} was not found.`);
  }
});

router.post("/", async (req, res) => {
  const { body: product } = req;
  try {
    // const newProduct = await productManager.addProduct(product);
    const newProduct = await productsModel.create(product);
    // Send the signal on the socket that a new product has been added
    // req.socket.emit("productAdded", newProduct);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { body: product } = req;
  // const { id: stringId } = req.params;
  const { id } = req.params;
  // const id = parseInt(stringId);
  try {
    const dbOperationResult = await productsModel.updateOne(
      { _id: id },
      product
    );
    if (dbOperationResult.matchedCount >= 1) {
      res.status(200).send("The product was updated successfully.");
      return;
    } else {
      res
        .status(404)
        .send(
          `No matching product was found with the ID ${id}. It can't be modified.`
        );
      return;
    }
    // if (!matchingProduct) {
    //   res
    //     .status(404)
    //     .send(
    //       `No matching product was found with the ID ${id}. It can't be modified.`
    //     );
    //   return;
    // }
    // await productManager.updateProduct(id, product);
  } catch (error) {
    res.status(500).send({
      message:
        "There was been an error with the server. Please try again later.",
      exception: error.stack,
    });
  }
});

router.delete("/:id", async (req, res) => {
  // const { id: stringId } = req.params;
  // const id = parseInt(stringId);
  const { id  } = req.params;
  try {
    // const matchingProduct = await productManager.getProductById(id);
    // if (!matchingProduct) {
    //   res
    //     .status(404)
    //     .send(
    //       `No matching product was found with the ID ${id}. It can't be deleted.`
    //     );
    //   return;
    // }
    // await productManager.deleteProduct(id);
    // Send the signal on the socket that a new product has been added
    // req.socket.emit("productDeleted", id);
      const dbOperationResult = await productsModel.deleteOne(
        { _id: id }
      );
      if (dbOperationResult.deletedCount >= 1) {
        res.status(200).send("The product was deleted successfully.");
        return;
      } else {
        res
          .status(404)
          .send(
            `No matching product was found with the ID ${id}. It can't be modified.`
          );
        return;
      }
    res.status(200).send("The product was deleted successfully.");
  } catch (error) {
    res.status(500).send({
      message:
        "There was been an error with the server. Please try again later.",
      exception: error.stack,
    });
  }
});

module.exports = router;
