const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(el => el.id === id);
            let updatedProduct;
            if (existingProductIndex >= 0) {
                cart.products[existingProductIndex].qty += 1;
            } else {
                updatedProduct = {
                    id: id,
                    qty: 1
                };
                cart.products.push(updatedProduct);
            }
            cart.totalPrice = cart.totalPrice + Number(price);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    static deleteProduct(id, productPrice) {
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, fileContent) => {
                let updatedCart;
                if (err) {
                    reject(err);
                } else {
                    let cart = JSON.parse(fileContent);
                    const isEqualId = (le) => le.id === id;
                    const hasProduct = cart.products.some(isEqualId);
                    if (hasProduct) {
                        const productIndex = cart.products.findIndex(isEqualId);
                        const productQty = cart.products[productIndex].qty;
                        const updatedProducts = cart.products.filter(el => el.id !== id);
                        const updatedTotalPrice = cart.totalPrice - Number(productPrice) * productQty;
                        updatedCart = {
                            products: updatedProducts,
                            totalPrice: updatedTotalPrice
                        };
                    } else {
                        updatedCart = { ...cart };
                    }
                    fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    static getCartProducts() {
        return new Promise((resolve, reject) => {
            let cartProducts;
            fs.readFile(p, (err, fileContent) => {
                if (err) {
                    reject(new Error("Fail opening the Cart: ", err));
                } else {
                    cartProducts = JSON.parse(fileContent);
                    resolve(cartProducts);
                }
            });
        });
    }
};