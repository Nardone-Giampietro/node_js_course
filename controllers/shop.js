const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const {validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const {generateInvoice} = require("../util/pdf_generator");

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
        .catch(err =>{
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

exports.postCart =  (req, res, next) => {
    const productId = req.body.productId.toString();
    User.findById(req.session.user._id)
        .then(async user => {
            await user.addToCart(productId);
            console.log("Product added to cart.");
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        })
};

exports.postOrders = async (req, res, next) => {
    const user = await User.findById(req.session.user._id);
    await user.populate("cart.items.productId", ["title", "price"]);
    const items = user.cart.items.toObject();
    const orderNew = new Order({
        userId: user.id,
        products: items,
    });
    orderNew.save()
        .then( order => {
            user.cart.items = [];
            const orderId = order._id.toString();
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join("data", "invoices", invoiceName);
            generateInvoice(order, invoicePath);
            return user.save()
        })
        .then( result =>{
            res.status(201).redirect('/orders');
            })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const result = validationResult(req);

    if (!result.isEmpty()){
        const message = result.array()[0].msg;
        switch (message) {
            case "404":
                return res.status(404).render('templates/404', {message: "File not Found."});
            case "403":
                return res.status(403).render('templates/403', {message: "Cannot access this File."});
            case "500":
                return res.status(500).render('templates/500', {message: "Database Error"});
            case "400":
                return res.status(400).render('templates/400', {message: "Invalid Input"});
        }
    }
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);
    const file = fs.createReadStream(invoicePath);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
    file.pipe(res);
}