const { Router } = require("express");
const ProductManager = require("../../productManager");

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
  const id = parseInt(req.params.id);
  product = await productManager.getProductById(id);
  if (product) {
    res.send(product);
  } else {
    res.status(404);
    res.send(`The product with the id ${id} was not found.`);
  }
});

router.post("/", async (req, res) => {
  const { body: product } = req;
  try {
    const newProduct = await productManager.addProduct(product);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { body: product } = req;
  const { id: stringId } = req.params;
  const id = parseInt(stringId);
  try {
    const matchingProduct = await productManager.getProductById(id);
    if (!matchingProduct) {
      res.status(404).send(`No matching product was found with the id ${id}. It can't be modified.`);
      return;
    }
    await productManager.updateProduct(id, product);
    res.status(200).send('The product was updated successfully.');
  } catch (error) {
    res.status(500).send({
      message:
        'There was been an error with the server. Please try again later.',
      exception: error.stack,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id: stringId } = req.params;
  const id = parseInt(stringId);
  try {
    const matchingProduct = await productManager.getProductById(id);
    if (!matchingProduct) {
      res.status(404).send(`No matching product was found with the id ${id}. It can't be deleted.`);
      return;
    }
    await productManager.deleteProduct(id);
    res.status(200).send('The product was deleted successfully.');
  } catch (error) {
    res.status(500).send({
      message:
        'There was been an error with the server. Please try again later.',
      exception: error.stack,
    });
  }
});

module.exports = router;