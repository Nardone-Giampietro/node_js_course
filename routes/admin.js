const express = require("express");

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);
router.get('/products', productsController.getAdminProducts);
router.get('/edit-product/:productID', productsController.getProductEdit);

router.post("/add-product", productsController.postAddProduct);
router.post('/edit-product', productsController.postProductEdit);
router.post('/delete-product', productsController.postProductDelete);

module.exports = { router };