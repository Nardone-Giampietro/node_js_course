const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(__dirname, '..', 'data', 'products.json');

module.exports = class Product {
    constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = Number(price);
    }

    static update(id, title, url, descr, price, del = false) {
        const updateProduct = {
            id: id,
            title: title,
            imageURL: url,
            description: descr,
            price: Number(price)
        };
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, fileContent) => {
                let products = [];
                if (err) {
                    reject(new Error("File not found: ", err));
                } else {
                    products = JSON.parse(fileContent);
                    if (del) {
                        const productIndex = products.findIndex(el => el.id == id);
                        const productPrice = products[productIndex].price;
                        products = products.filter(el => el.id !== id);
                        Cart.deleteProduct(id, productPrice);
                    } else {
                        const productIndex = products.findIndex(el => el.id == id);
                        if (productIndex >= 0) {
                            products[productIndex] = { ...updateProduct };
                        } else {
                            reject(new Error("Product not found"));
                        }
                    }
                    fs.writeFile(p, JSON.stringify(products), (err) => {
                        if (err) {
                            reject(new Error("Error during writing of file: ", err))
                        }
                    });
                    resolve();
                }
            });
        });
    }

    save() {
        // Each product needs to have an unique id in order to be identified
        this.id = Math.random().toString();
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static fetchAll() {
        return new Promise((resolve, reject) => {
            let data;
            fs.readFile(p, (err, fileContent) => {
                if (err) {
                    data = [];
                } else {
                    data = JSON.parse(fileContent);
                }
                resolve(data);
            });
        });
    }

    static fetchOnlyCartProducts(cart) {
        /**
         *  return cartItems =
         *      {
         *          products: [
         *              id: **,
         *              title: **,
         *              description: **,
         *              price: **,
         *              qty: **,
         *          ],
         *          totalPrice: **   
         *      }
         */
        const cartItems = { ...cart };
        return this.fetchAll()
            .then(allProducts => {
                return new Promise((resolve, reject) => {
                    if (cartItems.products.length >= 1) {
                        for (let product of allProducts) {
                            const cartItemIndex = cartItems.products.findIndex(el => el.id == product.id);
                            if (cartItemIndex >= 0) {
                                Object.assign(cartItems.products[cartItemIndex], {
                                    title: product.title,
                                    imageURL: product.imageURL,
                                    description: product.description,
                                    price: product.price
                                });
                            }
                        }
                        resolve(cartItems);
                    } else {
                        resolve(cartItems);
                    }
                });
            });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            let products;
            fs.readFile(p, (err, fileContent) => {
                if (!err) {
                    products = JSON.parse(fileContent);
                    const product = products.find(p => p.id === id);
                    resolve(product);
                } else {
                    reject(err);
                }
            });
        });
    }
} 