const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    res.render('templates/index', {
        pageTitle: 'Home',
        path: '/'
    })
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({raw: true});
        })
        .then(cart => {
            res.render('templates/cart', {
                cart: cart,
                pageTitle: 'Cart',
                path: '/cart'
            });
        })
        .catch(error => console.log(error));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let userCart;

    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return userCart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let quantity = 1;
            if (product != undefined) {
                const oldQuantity = product.CartItem.quantity;
                quantity = oldQuantity + 1;
                return userCart.addProduct(product, {
                    through: {
                        quantity: quantity
                    }
                });
            } else {
                return Product.findByPk(prodId)
                    .then(product => {
                        return userCart.addProduct(product, {
                            through: {quantity: quantity}
                        });
                    })
                    .catch(err => console.log(err));
            }
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(error => console.log(error));
};

exports.postCartDelete = (req, res, next) => {
    const prodId = req.body.productId;
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return userCart.getProducts({where: {id: prodId}});
        })
        .then(product => {
            return userCart.removeProduct(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};


exports.getCheckout = (req, res, next) => {
    res.render('templates/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
};

exports.postCreateOrder = (req, res, next) => {
    let cartProducts;
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            cartProducts = products;
            return req.user.createOrder();
        })
        .then(order => {
            return order.addProducts(cartProducts.map(product => {
                product.OrderItem = {
                    quantity: product.CartItem.quantity,
                }
                return product;
            }));
        })
        .then(() => {
            return userCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
};

exports.getOrder = (req, res, next) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            const userOrders = JSON.parse(JSON.stringify(orders));
            res.render('templates/orders', {
                pageTitle: 'Order',
                path: '/orders',
                orders: userOrders
            })
        })
        .catch(err => console.log(err));
};