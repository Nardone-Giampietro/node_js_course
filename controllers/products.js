const Product = require('../models/product');

exports.getProduct = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop', {
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
    res.redirect('/');
};
