// This is the files that define how a generic product of the shop is structured. 
// We will use a class in order to construct a product, but this is not mandatory.

// const products = []; USING AN ARRAY TO STORE DATA

const fs = require('fs'); // USING A FILE TO STORE DATA
const path = require('path');
const p = path.join(__dirname, '..', 'data', 'products.json');


module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    // this method stores the data inside the array products
    save() {
        fs.readFile(p, (err, fileContent) => {
            let products = []; // create a new array
            if (!err) {
                // if the file is not empty, convert the json content into a js object
                products = JSON.parse(fileContent);
            }
            products.push(this); // push the new content inside the products array
            // rewrite all the content inside the file, converting the JS array to JSON
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
        // products.push(this); ARRAY STORING METHOD
    }
    // this is a method that will take the info form ALL the producs, so it is not
    // limited to the single product.
    // "static" means that we can call this method directly from the class, without 
    // the need of creating an istance of this calss
    static fetchAll() {
        // Since this function fetchAll is Async, in order to make shure that the products
        // file has been read before the shop page is rendered, we use a Promise that, if resolved,
        // before the shop page is rendered, we use a Promise that, if resolved, will return the
        // data and only then the shop page is rendered with the correct data.
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