const {mongoConnect, getDB} = require('../util/database');
const {ObjectId} = require("mongodb");

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
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