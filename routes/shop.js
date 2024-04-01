const express = require("express");

const rootDir = require("../util/path");
const { adminProducts } = require("./admin");

const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.render('shop', { products: adminProducts, pageTitle: 'Shop', path: '/' });
});


module.exports = router;
