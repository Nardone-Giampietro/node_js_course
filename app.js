const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { router: adminRouters } = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const errorController = require("./controllers/error");
const csrf = require("csurf");
const flash = require("connect-flash");
const {protect} = require("./util/auth");
const { Liquid } = require('liquidjs');

const app = express();
const engine = new Liquid({
    root: ['views/'],
    layouts: ['views/layouts/'],
    partials: ['views/partials'],
    extname: '.liquid'
});

const csrfProtection = csrf({});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI })
}));

app.engine('liquid', engine.express());
app.set('view engine', 'liquid');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")))

app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(flash());

app.use('/admin', protect, adminRouters);
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


