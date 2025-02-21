const Product = require('../models/product');
const {validationResult } = require('express-validator');
const {deleteFile} = require('../util/file');

const ITEMS_PER_PAGE= 2;

exports.getProducts = async (req, res, next) => {
    let page = Number(req.query.page) || 1;
    let pagination;
    let nSkip;
    try {
        const count = await Product.countDocuments({});
        let quotient = Math.floor(count / ITEMS_PER_PAGE);
        let remainder = count % ITEMS_PER_PAGE;
        pagination = remainder > 0 ? quotient + 1 : quotient;
        if (page > pagination || page < 0) {
            page = 1;
        }
        nSkip = (page - 1) * ITEMS_PER_PAGE;
        Product.find({})
            .skip(nSkip)
            .limit(ITEMS_PER_PAGE)
            .lean()
            .then(products => {
                res.render('templates/product-list', {
                    products: products,
                    pageTitle: 'Shop',
                    path: '/products',
                    paginationNumber: pagination,
                    currentPage: page
                });
            })
            .catch(err => {
                throw err;
            });
    }
    catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
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
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

exports.getProductEdit = (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.session.user._id;
    Product.findOne({_id: productId, userId: userId}).lean()
        .then(product => {
            if (product) {
                res.render('templates/edit-product', {
                    product: product,
                    pageTitle: product.title,
                    path: `/admin/edit-product`,
                    errorMessage: null,
                    validationErrors: null,
                    oldInputs: null
                });
            } else {
                throw new Error("Product Not Found");
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

exports.postProductEdit = (req, res, next) => {
    const {productId, ...updatedProduct} = req.body;
    const image = req.file;
    if (image){
        deleteFile(req.body.imageUrl);
        updatedProduct.imageUrl = image.path;
    }
    const userId = req.session.user._id;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).render('templates/edit-product', {
            path: `/admin/edit-product`,
            pageTitle: 'Edit Product',
            errorMessage: result.array()[0].msg,
            oldInputs: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                productId: productId
            },
            validationErrors: result.array()
        });
    }
    Product.updateOne({_id: productId, userId: userId}, updatedProduct)
        .then(response => {
            if (response.matchedCount === 0) {
                console.log("Cannot edit product");
                return res.redirect('/');
            }
            res.redirect("/admin/products");
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

exports.postProductDelete = (req, res, next) => {
    const userId = req.session.user._id;
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            deleteFile(product.imageUrl);
            return Product.deleteOne({_id: productId, userId: userId})
        })
        .then(result => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};

exports.asyncProductDelete = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            deleteFile(product.imageUrl);
            return Product.deleteOne({_id: productId})
        })
        .then(result => {
            res.status(200).json({message: "Success."});
        })
        .catch(err => {
            res.status(500).json({message: "Deleting Product Failed."});
        });
}
exports.getAdminProducts = async (req, res, next) => {
    const userId = req.session.user._id;
    let page = Number(req.query.page) || 1;
    let pagination;
    let nSkip;
    try {
        const count = await Product.countDocuments({});
        let quotient = Math.floor(count / ITEMS_PER_PAGE);
        let remainder = count % ITEMS_PER_PAGE;
        pagination = remainder > 0 ? quotient + 1 : quotient;
        if (page > pagination || page < 0) {
            page = 1;
        }
        nSkip = (page - 1) * ITEMS_PER_PAGE;
        Product.find({userId: userId})
            .skip(nSkip)
            .limit(ITEMS_PER_PAGE)
            .lean()
            .then(products => {
                res.render('templates/products', {
                    products: products,
                    pageTitle: 'Admin Products',
                    path: '/admin/products',
                    paginationNumber: pagination,
                    currentPage: page
                });
            })
            .catch(err => {
                throw err;
            });
    }
    catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
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
    const image = req.file;
    const imageUrl = image.path;
    const result = validationResult(req);
    if (!image){
        return res.status(422).render('templates/add-product', {
            path: `/admin/add-product`,
            pageTitle: 'Add Product',
            errorMessage: "Attached file is not an image.",
            oldInputs: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
            },
            validationErrors: [{path: "image"}]
        });
    }
    if (!result.isEmpty()){
        return res.status(422).render('templates/add-product', {
            path: `/admin/add-product`,
            pageTitle: 'Add Product',
            errorMessage: result.array()[0].msg,
            oldInputs: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
            },
            validationErrors: result.array()
        });
    }
    const product = new Product(req.body);
    product.userId = req.session.user._id;
    product.imageUrl = imageUrl;
    product.save()
        .then(result => {
            res.status(201).redirect('/');
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            return next(error);
        });
};
