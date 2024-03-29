const http = require("http");

const express = require("express");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: true })); // this middleware is required in order for the body-parsing inside the next middlewares to work

app.use(adminRoutes);

app.use(shopRoutes);

app.listen(3000);


