const http = require("http");
const path = require("path");

const express = require("express");

const rootDir = require("./util/path");
const { router: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const { Liquid } = require('liquidjs');

const app = express();
const engine = new Liquid({
    // setting up the directories where the templates will be looked up in order
    root: ['views/', 'views/layouts', 'views/partials'],
    extname: '.liquid'
});

// pug templating engine
// app.set('view engine', 'pug');

// Setting the LiquidJS templating engine
app.engine('liquid', engine.express());
app.set('view engine', 'liquid');

// this can be omitted since ./views is he already the default directory
//app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(rootDir, "public")))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {

    res.status(404).render('404');
    //res.status(404).render('404', { pageTitle: 'Page Not Found' });
    //res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);

