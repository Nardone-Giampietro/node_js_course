// This file will contain all the logics that are relative to "products". This follow the MVC
// (Model View Controller) idea where, for example, we don't put all the logic inside the 
// routes files, but we put it inside a separate file like this. This because, for example, 
// the admin.js and shop.js files may have some "products" logic in common and so it is
// better to have it inside one file like this one. This will make changing the code 
// much easier while the project get bigger.

// This array needs to stay here because is is needed inside the "postAddProduct" and
// "getProduct" middleware functions
//const adminProducts = [];

const Product = require('../models/product');

exports.getProduct = (req, res, next) => {
    // the fetchAll() static method will return a promise (the file data) and only after that
    // the shop page is rendered with all the products data
    Product.fetchAll()
        .then(products => {
            res.render('shop', {
                // products: adminProducts,
                products: products,
                pageTitle: 'Shop',
                path: '/'
            });
        });
};

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    // adminProducts.push({ title: req.body.title });
    res.redirect('/');
};
