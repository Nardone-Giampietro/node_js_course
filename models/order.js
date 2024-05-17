const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now() },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {type: Number},
    }]

});

module.exports = Model("Order", orderSchema);