const express = require("express");

const productsController = require('../controllers/products');

const router = express.Router();

// This array is no more needed here because we use it inside the "products" controller
// const adminProducts = [];
router.use('/add-product/new-product', (req, res, next) => {
    res.send('<h1>This is the product page</h1>');
});
router.post("/add-product", productsController.postAddProduct);
router.get('/add-product', productsController.getAddProduct);


module.exports = { router };