const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find({}).lean()
        .then(products => {
            res.render('templates/product-list', {
                products: products,
                pageTitle: 'Shop',
                path: '/products',
                isAuthenticated: req.isAuthenticated
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
                path: `/products`,
                isAuthenticated: req.isAuthenticated,
            });
        })
        .catch(e => {
            console.log("Product not found:", e);
            res.redirect('/');
        });
};

exports.getProductEdit = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).lean()
        .then(product => {
            res.render('templates/edit-product', {
                product: product,
                pageTitle: product.title,
                path: `/admin/edit-product`,
                isAuthenticated: req.isAuthenticated
            });
        })
        .catch(e => {
            console.log("Product not found:", e);
            res.redirect('/');
        });
};

exports.postProductEdit = (req, res, next) => {
    const {productId, ...updatedProduct} = req.body;
    console.log(updatedProduct);
    Product.updateOne({_id: productId}, updatedProduct)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(e => {
            console.log(e);
            res.redirect('/');
        });
};

exports.postProductDelete = (req, res, next) => {
    Product.deleteOne({_id: req.body.productId})
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(e => {
            console.log(e);
            res.redirect("/admin/products");
        });
};

exports.getAdminProducts = (req, res, next) => {
    Product.find({}).lean()
        .then(products => {
            res.render('templates/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.isAuthenticated
            });
        });
};

exports.getAddProduct = (req, res, next) => {
    res.render('templates/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        isAuthenticated: req.isAuthenticated
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body);
    product.userId = req.user.toObject()._id;
    product.save()
        .then(result => {
            res.status(201).redirect('/', {
                isAuthenticated: req.isAuthenticated
            });
        })
        .catch(err => {
            console.log(err);
        })
};
