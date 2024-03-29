const express = require("express");

const router = express.Router();

router.use('/add-product/new-product', (req, res, next) => {
    res.send('<h1>This is the product page</h1>');
});


// We want this middleware to ne executed only on POST request, not on GET request.
// For this, instead of .use we can use .post. There is also .get for GET requestes.

// this is a change
router.post("/product", (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

router.get('/add-product', (req, res, next) => {
    res.send('<html><form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form></html>');
});

module.exports = router;