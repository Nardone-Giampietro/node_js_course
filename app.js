const http = require("http");
const path = require("path");

const express = require("express");

const rootDir = require("./util/path");
const { router: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const { Liquid } = require('liquidjs');

const app = express();
const engine = new Liquid({
    root: ['views/', 'views/layouts', 'views/partials'],
    extname: '.liquid'
});

app.engine('liquid', engine.express());
app.set('view engine', 'liquid');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(rootDir, "public")))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(3000);

