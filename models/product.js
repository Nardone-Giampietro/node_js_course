const {mongoConnect, getDB} = require('../util/database');
const {ObjectId} = require("mongodb");

class Product {
    constructor(title, price, description, imageURL, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageURL = imageURL;
        this._userId = userId;
    }

    static deleteProduct(id) {
        const db = getDB();
        const collection = db.collection('products');
        const userCollection = db.collection('users');
        const productId = new ObjectId(id);
        return collection.deleteOne({_id: productId})
            .then((result) => {
                return userCollection
                    .updateMany({}, {$pull: {"cart.items": {_productId: productId}}});
            })
            .catch(error => console.log(error));
    }

    static updateProduct(id, title, imageUrl, description, price) {
        const db = getDB();
        const collection = db.collection("products");
        const updatedData = {
            title: title,
            price: price,
            description: description,
            imageURL: imageUrl,
        }
        const productId = new ObjectId(id);
        const filter = {_id: productId};
        return collection.updateOne(filter, {$set: updatedData});
    }

    static async fetchProducts() {
        const db = getDB();
        const collection = db.collection("products");
        const findProduct = await collection.find();
        const products = [];
        for await (const product of findProduct) {
            products.push(await product);
        }
        ;
        return Promise.resolve(products);
    }

    static fetchProduct(productId) {
        const db = getDB();
        const id = new ObjectId(productId);
        return db.collection("products").findOne({_id: id});
    }

    save() {
        const db = getDB();
        const userId = new ObjectId(this._userId);
        return db.collection('products').insertOne(
            {
                title: this.title,
                price: this.price,
                description: this.description,
                imageURL: this.imageURL,
                _userId: userId
            }
        )
            .then(result => {
                console.log("Product Added");
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;