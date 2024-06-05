const express = require("express");
const {protect} = require("../util/auth");
const {body, param} = require("express-validator");
const Order = require("../models/order");

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

router.get("/orders/:orderId",
    [
    protect,
    param("orderId")
        .notEmpty()
        .isString()
        .trim()
        .isMongoId()
        .withMessage("400"),
    param("orderId")
        .custom(async (value, {req}) => {
            const userId = req.session.user._id;
            const order = await Order.findById(value).exec();
            if (!order) {
                throw new Error("404")
            }
            if (order.userId.toString() !== userId) {
                throw new Error("403");
            }
        })
    ]
    , shopController.getInvoice);

module.exports = router;
