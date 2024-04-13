const Product = require('../models/product');


exports.getIndex = (req, res, next) => {
    res.render('templates/index', {
        pageTitle: 'Home',
        path: '/'
    })
};

exports.getCart = (req, res, next) => {
    req.user.fetchCart()
        .then(cart => {
            res.render('templates/cart', {
                cart: cart,
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
    Product.fetchProduct(prodId)
        .then(foundProduct => {
            return req.user.addProductToCart(foundProduct);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart')
        })
        .catch(error => {
            console.log(error)
        });
};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteCartItem(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
};


exports.postOrder = (req, res, next) => {
    req.user.postOrders()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.log(error)
        });
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            console.log(orders);
            res.render('templates/orders', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/orders'
            })
        })
        .catch(error => {
            console.log(error)
        });

};