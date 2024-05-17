const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: true,
        default: `This is the description of the product ${this.title} with _id: ${this._id}`
    },
    imageUrl: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Product", ProductSchema);