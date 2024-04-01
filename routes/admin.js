const express = require("express");

const rootDir = require("../util/path");

const path = require("path");

const router = express.Router();

const adminProducts = [];

router.use('/add-product/new-product', (req, res, next) => {
    res.send('<h1>This is the product page</h1>');
});

router.post("/add-product", (req, res, next) => {
    adminProducts.push({ title: req.body.title });
    res.redirect('/');
});

router.get('/add-product', (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
});

module.exports = { router, adminProducts };