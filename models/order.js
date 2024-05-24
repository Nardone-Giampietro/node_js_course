const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now() },
    products: {
        type: Array
    }

});

module.exports = Model("Order", orderSchema);