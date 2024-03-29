const http = require("http");

const path = require("path");

const express = require("express");

const rootDir = require("./util/path");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: true })); // this middleware is required in order for the body-parsing inside the next middlewares to work

// This is a static path that can be reachd by the client. By this way, we can add stylesheet to the html files
app.use(express.static(path.join(rootDir, "public")))

// We can add a filter if this path is common for all the paths that are inside the adminRouters. Only routers that start with "/admin" will go inside
// this router.
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// this middleware will catch every request that doese not any of the previous routers. This would be our 404 page.
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);

