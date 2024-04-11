const http = require("http");
const path = require("path");

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-items');
const Order = require('./models/order');
const OrderItem = require('./models/order-items');

const express = require("express");

const {router: adminRouters} = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const {Liquid} = require('liquidjs');

const app = express();
const engine = new Liquid({
    root: ['views/'],
    layouts: ['views/layouts/'],
    partials: ['views/partials'],
    extname: '.liquid'
});

app.engine('liquid', engine.express());
app.set('view engine', 'liquid');

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            // We add a new field to the request object. By doing this, the user data will be always
            // available. Also, this is not a simple JS object but a full Sequelize object, so we
            // can call methods like "destroy" etc
            req.user = user;
            // We call next so the app will go on with the next Middlewares
            next();
        })
        .catch(err => console.log(err));
});
app.use('/admin', adminRouters);
app.use(shopRoutes);
app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, {
    constraints: true,
    foreignKey: 'userId',
    onDelete: 'CASCADE', // deleting a User will delete all the Products associated to it
});

User.hasOne(Cart);
Cart.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    constraints: true
});

User.hasMany(Order);
Order.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    constraints: true
});
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

Product.belongsToMany(Cart, {through: CartItem});
Cart.belongsToMany(Product, {through: CartItem});

// This will initialize the database with the new Models we created and associations
sequelize
    .sync()
    .then(results => {
        return User.findByPk(1); // Find if there is already a User
    })
    .then(user => {
        if (user === null) {
            return User.create({
                username: 'Giampietro',
                email: 'giampietro@gmail.com',
            })
                .then(user => {
                    return user.createCart();
                });
        } else {
            return Promise.resolve(user);
        }
    })
    .then(result => {
            console.log("sequelize sequelize success");
            //console.log(Object.keys(User.prototype)); //See all the methods a certain Model has
            // console.log(result);
            app.listen(3000);
        }
    ).catch(
    error => console.log(error)
);


