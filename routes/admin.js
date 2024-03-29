const express = require("express");

const rootDir = require("../util/path");

const path = require("path");

const router = express.Router();

router.use('/add-product/new-product', (req, res, next) => {
    res.send('<h1>This is the product page</h1>');
});

router.post("/add-product", (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

module.exports = router;