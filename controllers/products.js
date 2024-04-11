const Product = require('../models/product');
const {where} = require("sequelize");

exports.getProducts = (req, res, next) => {
    req.user.getProducts({raw: true})
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
    const productId = req.params.productID;
    Product.findOne({where: {id: productId}, raw: true})
        .then(product => {
            if (product === null) {
                console.log("Product Not Found");
                res.redirect(`/`);
            } else {
                res.render('templates/product-details', {
                    product: product,
                    pageTitle: product.title,
                    path: `/products`
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.redirect('/');
        });
};

exports.getProductEdit = (req, res, next) => {
    const productId = req.params.productID;
    req.user.getProducts({where: {id: productId}, raw: true})
        .then(products => {
            res.render('templates/edit-product', {
                product: products[0],
                pageTitle: products[0].title,
                path: `/admin/edit-product`
            });
        })
        .catch(error => {
            console.log(error);
            res.redirect('/');
        });
};

exports.postProductEdit = (req, res, next) => {
    const id = req.body.productID;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    Product.update({
        title: title,
        imageURL: imageUrl,
        description: description,
        price: price,
    }, {
        where: {
            id: id
        }
    })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(error => {
            console.log(error);
            res.redirect('/');
        });
};

exports.postProductDelete = (req, res, next) => {
    const id = req.body.productID;
    Product.destroy({where: {id: id}})
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(error => {
            console.log(error);
            res.redirect("/admin/products");
        });
};

exports.getAdminProducts = (req, res, next) => {
    Product.findAll({raw: true})
        .then(products => {
            res.render('templates/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(error => console.log(error));
};

exports.getAddProduct = (req, res, next) => {
    res.render('templates/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    req.user
        .createProduct({
            title: title,
            imageURL: imageUrl,
            description: description,
            price: price
        })
        .then(result => {
            res.redirect("/admin/products");
        })
        .catch(error => console.log(error));
};
