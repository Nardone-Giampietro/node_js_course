const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    res.render('templates/index', {
        user: req.user.toObject(),
        pageTitle: 'Home',
        path: '/'
    })
};

exports.getCart = (req, res, next) => {
    const userId = req.user._id.toString();
    User.findById(userId)
        .populate("cart.items.productId", ["title", "price", "imageUrl"])
        .lean()
        .then(result => {
            res.render('templates/cart', {
                cart: result.cart.items,
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
    const productId = req.body.productId.toString();
    req.user.addToCart(productId)
        .then(result => {
            console.log("Product added to cart.");
            res.redirect('/cart');
        });
};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId.toString();
    const updatedCart = req.user.cart.items.filter(item => item.productId.toString() !== prodId);
    req.user.cart.items = updatedCart;
    req.user.save()
        .then(result => {
            console.log("Product deleted from cart.");
            res.redirect('/cart');
        })
        .catch(e => {console.log(e); res.redirect('/');});
};


exports.getOrders = (req, res, next) => {
    const userId = req.user._id.toString();
    Order.find()
        .where("userId").equals(userId)
        .populate("products.productId", ["title"])
        .select("-userId")
        .lean()
        .then(result =>{
            res.render('templates/orders', {
                orders: result,
                pageTitle: 'Orders',
                path: '/orders'
            })
        })
};

exports.postOrders = (req, res, next) => {
    const order = new Order({
        userId: req.user._id,
        products: req.user.cart.items
    });
    order.save()
        .then(result => {
            req.user.cart.items = [];
            return req.user.save();
        })
        .then( result =>{
            res.status(201).redirect('/orders');
            })
        .catch(e => {console.log(e); res.redirect('/');});
};