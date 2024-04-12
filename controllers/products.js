const Product = require('../models/product');
const res = require("express/lib/response");

exports.getProducts = (req, res) => {
    Product.fetchProducts()
        .then(products => {
            res.render('templates/product-list', {
                products: products,
                pageTitle: 'Shop',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
    const productId = req.params.productID;
    Product.fetchProduct(productId)
        .then(product => {
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

exports.getProductEdit = (req, res) => {
    const productId = req.params.productID;
    Product.fetchProduct(productId)
        .then(product => {
            res.render('templates/edit-product', {
                product: product,
                pageTitle: product.title,
                path: `/admin/edit-product`
            });
        })
        .catch(e => {
            console.log("Product not found:", e);
            res.redirect('/');
        });
};

exports.postProductEdit = (req, res) => {
    const id = req.body.productID;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    Product.updateProduct(id, title, imageUrl, description, price)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(e => {
            console.log(e);
            res.redirect('/');
        });
};

exports.postProductDelete = (req, res) => {
    const id = req.body.productID;
    Product.deleteProduct(id)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(e => {
            console.log(e);
            res.redirect("/admin/products");
        });
};

exports.getAdminProducts = (req, res) => {
    Product.fetchProducts()
        .then(products => {
            res.render('templates/products', {
                products: products,
                pageTitle: 'Shop',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getAddProduct = (req, res) => {
    res.render('templates/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, next) => {
    const userId = req.user._id;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, price, description, imageUrl, userId);
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
};
