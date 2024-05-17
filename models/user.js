const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product'},
            quantity: {type: Number, default: 0},
        }]
    }
});
userSchema.index({email: 1});

userSchema.methods.addToCart = function (productId) {
    const index = this.cart.items.findIndex(el => el.productId.toString() === productId.toString());
    if (index < 0) {
        const newProduct = {
            productId: productId,
            quantity: 1
        }
        this.cart.items.push(newProduct);
    } else {
        this.cart.items[index].quantity++;
    }
    return this.save();
}

module.exports = Model("User", userSchema);

