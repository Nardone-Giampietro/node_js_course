const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    res.render('templates/index', {
        user: req.session.isLoggedIn ? req.session.user.email : null,
        pageTitle: 'Home',
        path: '/'
    })
};

exports.getCart = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then(user =>{
            res.render('templates/cart', {
                cart: user.cart.items.toObject(),
                pageTitle: 'Cart',
                path: '/cart'
            });
        })
        .catch(err => console.log(err));
};

exports.postCart =  (req, res, next) => {
    const productId = req.body.productId.toString();
    User.findById(req.session.user._id)
        .then(async user => {
            await user.addToCart(productId);
            console.log("Product added to cart.");
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId.toString();
    User.findById(req.session.user._id)
        .then(user =>{
            const updatedCart = user.cart.items.filter(item => item.productId.toString() !== prodId);
            user.cart.items = updatedCart;
            return user.save()
        })
        .then(result => {
            console.log("Product deleted from cart.");
            res.redirect('/cart');
        })
        .catch(e => {console.log(e); res.redirect('/');});
};


exports.getOrders = (req, res, next) => {
    const userId = req.session.user._id;
    Order.find()
        .where("userId").equals(userId)
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

exports.postOrders = async (req, res, next) => {
    const user = await User.findById(req.session.user._id);
    await user.populate("cart.items.productId", ["title"]);
    const items = user.cart.items.toObject();
    const order = new Order({
        userId: user.id,
        products: items,
    });
    order.save()
        .then(result => {
            user.cart.items = [];
            return user.save()
        })
        .then( result =>{
            res.status(201).redirect('/orders');
            })
        .catch(e => {console.log(e); res.redirect('/');});
};