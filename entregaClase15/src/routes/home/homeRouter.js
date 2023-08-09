const { Router } = require('express');
const productManager = require('../../dao/managers/mongoDB/productManager');

const router = Router();
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    const isAdminBoolean = req.user.role === 'admin';
    res.render('home', {
        products,
        user: {
            ...req.user,
            isAdmin: isAdminBoolean
        },
        jsFilename: 'home',
        styleFilename: 'home'
    });
});

module.exports = router;
