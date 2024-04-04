const express = require("express");

const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", productsController.getProducts);
// the : after /products/ will tell express that everything after that can be stored inside
// "productID"
router.get("/products/:productID", productsController.getProduct);

router.get("/cart", shopController.getCart);
router.post("/cart-delete-item", shopController.postCartDelete);

router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);

router.post("/cart", shopController.postCart);

module.exports = router;
