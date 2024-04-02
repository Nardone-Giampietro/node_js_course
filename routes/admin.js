const express = require("express");

const productsController = require('../controllers/products');

const router = express.Router();

router.use('/add-product/new-product', (req, res, next) => {
    res.send('<h1>This is the product page</h1>');
});
router.post("/add-product", productsController.postAddProduct);
router.get('/add-product', productsController.getAddProduct);


module.exports = { router };