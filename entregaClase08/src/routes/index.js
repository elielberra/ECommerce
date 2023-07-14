const { Router } = require('express');
const ProductsRouter = require('./api/products.router')
const CartsRouter = require('./api/carts.router')

const router = Router();

router.use('/products', ProductsRouter);
router.use('/carts', CartsRouter);

module.exports = {
    api: router
}