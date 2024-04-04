const Cart = require('../models/cart');
const Product = require('../models/product');


exports.getIndex = (req, res, next) => {
    res.render('templates/index', {
        pageTitle: 'Home',
        path: '/'
    })
};

exports.getCart = (req, res, next) => {
    Cart.getCartProducts()
        .then(cart => {
            return Product.fetchOnlyCartProducts(cart);
        })
        .then(cartItems => {
            res.render('templates/cart', {
                cart: cartItems,
                pageTitle: 'Cart',
                path: '/cart'
            });
        })
        .catch(e => {
            console.log(e);
            res.redirect('/');
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(foundProduct => {
            Cart.addProduct(prodId, foundProduct.price);
            res.redirect('/cart');
        });
};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(foundProduct => {
            return Cart.deleteProduct(prodId, foundProduct.price);
        })
        .then(() => {
            res.redirect('/cart');
        });
};


exports.getCheckout = (req, res, next) => {
    res.render('templates/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
};

exports.getOrders = (req, res, next) => {
    res.render('templates/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    })
};