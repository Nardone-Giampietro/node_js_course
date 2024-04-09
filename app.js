const http = require("http");
const path = require("path");

const db = require('./util/database');

const express = require("express");

const { router: adminRouters } = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const { Liquid } = require('liquidjs');

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

app.listen(3000);

