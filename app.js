const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");
const { router: adminRouters } = require("./routes/admin");
const shopRoutes = require("./routes/shop");
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

app.use(express.static(path.join(__dirname, "public")))

app.use('/admin', adminRouters);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose.connect(process.env.DATABASE_URI)
    .then(async result => {
        try {
            const user = new User({
                name: "Giampietro",
                email: "giampietro@gmail.com",
                cart: {
                    items: []
                }
            });
            await user.save();
            req.user = user;
        }
        catch (error){
            console.log("User already exist.");
            req.user = await User.findOne({email: "giampietro@gmail.com"}).exec();
        }
        app.listen(process.env.DEV_PORT, () =>
        {
            console.log("connection started at port", process.env.DEV_PORT);
        });
    })
    .catch(err => console.log(err));


