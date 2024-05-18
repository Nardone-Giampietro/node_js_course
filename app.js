const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");
const { router: adminRouters } = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const errorController = require("./controllers/error");
const User = require("./models/user");

const { Liquid } = require('liquidjs');
const req = require("express/lib/request");

const app = express();
const engine = new Liquid({
    root: ['views/'],
    layouts: ['views/layouts/'],
    partials: ['views/partials'],
    extname: '.liquid'
});

app.engine('liquid', engine.express());
app.set('view engine', 'liquid');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next)=>{
    User.findById("6647725919a66acfc53021c2")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => console.log(error));
});

app.use('/admin', adminRouters);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose.connect(process.env.DATABASE_URI)
    .then(async result => {
        app.listen(process.env.DEV_PORT, () =>
        {
            console.log("connection started at port", process.env.DEV_PORT);
        });
    })
    .catch(err => console.log(err));


