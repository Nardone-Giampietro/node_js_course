const express = require("express");

const rootDir = require("../util/path");
const { adminProducts } = require("./admin");

const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
    // The limit of this type of data sharing is that all the clients will see all the data  and there will be not differentiation. 
    // Most of the time we want each customer to see a specific type of data. The Database will let us do so. 
    //console.log(products);

    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', { products: adminProducts, pageTitle: 'Shop', path: '/' });
});


module.exports = router;
