const { Router } = require('express');
const ProductsRouter = require('./api/products.router')

const router = Router();

router.use('/products', ProductsRouter);

module.exports = {
    api: router
}