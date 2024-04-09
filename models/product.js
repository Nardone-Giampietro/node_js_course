const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const db = require('../util/database');

const p = path.join(__dirname, '..', 'data', 'products.json');

module.exports = class Product {
    constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = Number(price);
    }

    add() {
        return db.execute(`INSERT INTO products (title, price, description, imageURL) VALUES (?, ?, ?, ?)`,
            [this.title, this.price, this.description, this.imageURL]
        );
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
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
                            const cartItemIndex = cartItems.products.findIndex(el => el.id === product.id);
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
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
} 