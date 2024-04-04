const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('templates/product-list', {
                products: products,
                pageTitle: 'Shop',
                path: '/products'
            });
        });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productID;
    Product.findById(productId)
        .then(foundProduct => {
            res.render('templates/product-details', {
                product: foundProduct,
                pageTitle: foundProduct.title,
                path: `/products`
            });
        })
        .catch(e => {
            console.log("Product not found:", e);
            res.redirect('/');
        });
};

exports.getProductEdit = (req, res, next) => {
    const productId = req.params.productID;
    Product.findById(productId)
        .then(foundProduct => {
            res.render('templates/edit-product', {
                product: foundProduct,
                pageTitle: foundProduct.title,
                path: `/admin/edit-product`
            });
        })
        .catch(e => {
            console.log("Product not found:", e);
            res.redirect('/');
        });
};

exports.postProductEdit = (req, res, next) => {
    const id = req.body.productID;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const descrition = req.body.description;
    const price = req.body.price;
    Product.update(id, title, imageUrl, descrition, price)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(e => {
            console.log(e);
            res.redirect('/');
        });
};

exports.postProductDelete = (req, res, next) => {
    const id = req.body.productID;
    Product.update(id, null, null, null, null, del = true)
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(e => {
            console.log(e);
            res.redirect("/admin/products");
        });
};

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('templates/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        });
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
    const descrition = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageUrl, descrition, price);
    product.save();
    res.redirect('/');
};
