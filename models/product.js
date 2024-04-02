const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'data', 'products.json');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
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
}