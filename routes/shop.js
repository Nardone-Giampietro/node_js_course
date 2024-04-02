const express = require("express");

// We extract the Controllers that are related to the products
const productsController = require('../controllers/products');

const router = express.Router();

router.get("/", productsController.getProduct);

module.exports = router;
