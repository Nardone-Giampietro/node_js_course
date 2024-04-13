const {mongoConnect, getDB} = require('../util/database');
const {ObjectId} = require("mongodb");

class User {
    constructor(username, email, userId, cart) {
        this.username = username;
        this.email = email;
        this._id = userId;
        this.cart = cart;
    }

    addProductToCart(product) {
        const db = getDB();
        const collection = db.collection("users");
        const productId = new ObjectId(product._id);
        const userID = new ObjectId(this._id);
        const updatedCart = {_productId: productId};
        return collection.updateOne({_id: userID, "cart.items._productId": {$ne: productId}}, {
            $push: {"cart.items": updatedCart}
        })
            .then(() => {
                return collection.updateOne({_id: userID, "cart.items._productId": productId},
                    {$inc: {"cart.items.$.quantity": 1}});
            })
            .catch(error => console.log(error));
    }

    deleteCartItem(product) {
        const db = getDB();
        const collection = db.collection("users");
        const removedProduct = this.cart.items.find(p => {
            return p._productId.toString() === product.toString();
        });
        return collection.updateOne({_id: new ObjectId(this._id)},
            {$pull: {"cart.items": {$eq: removedProduct}}});
    }

    async fetchCart() {
        const db = getDB();
        const productCollection = db.collection("products");
        const items = this.cart.items;
        for (let index = 0; index < items.length; index++) {
            const product = await productCollection.find({_id: new ObjectId(items[index]._productId)})
                .project({_userId: 0, description: 0, _id: 0})
                .next();
            items[index] = {...items[index], ...product};
        }
        return Promise.resolve(items);
    }

    postOrders() {
        const db = getDB();
        const ordersCollection = db.collection("orders");
        const userCollection = db.collection("users");
        return this.fetchCart()
            .then(cartItems => {
                return ordersCollection.insertOne({items: cartItems, _userId: this._id});
            })
            .then(() => {
                return userCollection.updateOne({_id: new ObjectId(this._id)},
                    {$set: {cart: {items: []}}});
            })
            .catch(error => console.log(error));
    }

    async getOrders() {
        const db = getDB();
        const ordersCollection = db.collection("orders");
        const cursor = ordersCollection.find({_userId: new ObjectId(this._id)});
        const orders = [];
        for await (const order of cursor) {
            orders.push(await order);
        }
        return Promise.resolve(orders);
    }

    save() {
        const db = getDB();
        const collection = db.collection('users');
        return collection.insertOne(this);
    }

    static findUser(userId) {
        const db = getDB();
        const collection = db.collection('users');
        const id = new ObjectId(userId);
        return collection.findOne({_id: id});
    }
}

module.exports = User;