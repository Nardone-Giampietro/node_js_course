const express = require("express");
const {protect} = require("../util/auth");

const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", productsController.getProducts);

router.get("/products/:productId", productsController.getProduct);

router.get("/cart", protect, shopController.getCart);
router.post("/cart-delete-item",protect, shopController.postCartDelete);

router.get("/orders", protect, shopController.getOrders);
router.post("/orders", protect, shopController.postOrders)
router.post("/cart", protect, shopController.postCart);

module.exports = router;
