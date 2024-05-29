const Product = require('../models/product');
const {validationResult } = require('express-validator');

exports.getProducts = (req, res, next) => {
    Product.find({}).lean()
        .then(products => {
            res.render('templates/product-list', {
                products: products,
                pageTitle: 'Shop',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .populate("userId")
        .select("-userId.cart -userId.email")
        .lean()
        .then( product => {
            res.render('templates/product-details', {
                product: product,
                pageTitle: product.title,
                path: `/products`
            });
        })
        .catch(e => {
            console.log("Product not found:", e);
            res.redirect('/');
        });
};

exports.getProductEdit = (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.session.user._id;
    Product.findOne({_id: productId, userId: userId}).lean()
        .then(product => {
            res.render('templates/edit-product', {
                product: product,
                pageTitle: product.title,
                path: `/admin/edit-product`,
                errorMessage: null,
                validationErrors: null,
                oldInputs: null
            });
        })
        .catch(e => {
            console.log("Product not found:", e);
            res.redirect('/');
        });
};

exports.postProductEdit = (req, res, next) => {
    const {productId, ...updatedProduct} = req.body;
    const userId = req.session.user._id;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(422).render('templates/edit-product', {
            path: `/admin/edit-product`,
            pageTitle: 'Edit Product',
            errorMessage: result.array()[0].msg,
            oldInputs: {
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                price: req.body.price,
                description: req.body.description,
                productId: productId
            },
            validationErrors: result.array()
        });
    }
    else {
        Product.updateOne({_id: productId, userId: userId}, updatedProduct)
            .then(response => {
                if (response.matchedCount === 0) {
                    console.log("Cannot edit product");
                    return res.redirect('/');
                }
                res.redirect("/admin/products");
            })
            .catch(e => {
                console.log(e);
                res.redirect('/');
            });
    }
};

exports.postProductDelete = (req, res, next) => {
    const userId = req.session.user._id;
    Product.deleteOne({_id: req.body.productId, userId: userId})
        .then(result => {
            res.redirect("/admin/products");
        })
        .catch(e => {
            console.log(e);
            res.redirect("/admin/products");
        });
};

exports.getAdminProducts = (req, res, next) => {
    const userId = req.session.user._id;
    Product.find({userId: userId}).lean()
        .then(products => {
            res.render('templates/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        });
};

exports.getAddProduct = (req, res, next) => {
    res.status(200).render('templates/add-product', {
        path: `/admin/add-product`,
        pageTitle: 'Add Product',
        errorMessage: null,
        oldInputs: null,
        validationErrors: null
    });
};

exports.postAddProduct = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()){
        res.status(422).render('templates/add-product', {
            path: `/admin/add-product`,
            pageTitle: 'Add Product',
            errorMessage: result.array()[0].msg,
            oldInputs: {
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                price: req.body.price,
                description: req.body.description,
            },
            validationErrors: result.array()
        });
    } else {
        const product = new Product(req.body);
        product.userId = req.session.user._id;
        product.save()
            .then(result => {
                res.status(201).redirect('/');
            })
            .catch(err => {
                console.log(err);
            })
    }

};
