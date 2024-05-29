const express = require("express");
const productsController = require('../controllers/products');
const router = express.Router();
const {body} = require("express-validator");

router.get('/add-product', productsController.getAddProduct);
router.get('/products', productsController.getAdminProducts);
router.get('/edit-product/:productId', productsController.getProductEdit);

router.post("/add-product",
    [
    body("title", "Invalid Title")
        .notEmpty()
        .isString()
        .isLength({min: 3})
        .trim()
        .customSanitizer((value) => {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }),
    body("imageUrl", "Invalid URL")
        .notEmpty()
        .trim()
        .isURL({allow_query_components: false}),
    body("price", "Invalid Price")
        .notEmpty()
        .trim()
        .isCurrency({digits_after_decimal: [1, 2], allow_negatives: false}),
    body("description", "Invalid Description")
        .notEmpty()
        .isString()
        .isLength({ min: 5 })
        .unescape(),
],
    productsController.postAddProduct);
router.post('/edit-product',
    [
        body("title", "Invalid Title")
            .notEmpty()
            .isString()
            .isLength({min: 3})
            .trim()
            .customSanitizer((value) => {
                return value.charAt(0).toUpperCase() + value.slice(1);
            }),
        body("imageUrl", "Invalid URL")
            .notEmpty()
            .trim()
            .isURL({allow_query_components: false}),
        body("price", "Invalid Price")
            .notEmpty()
            .trim()
            .isCurrency({digits_after_decimal: [1, 2], allow_negatives: false}),
        body("description", "Invalid Description")
            .notEmpty()
            .isString()
            .isLength({ min: 5 })
            .unescape()
    ],
    productsController.postProductEdit);
router.post('/delete-product', productsController.postProductDelete);

module.exports = { router };