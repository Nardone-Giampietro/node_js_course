const express = require("express");

const rootDir = require("../util/path");

// This package is required in order to work with paths, like joining them
const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
    // __dirname is a global variable that store the path off the folder we are in
    // The path returned by path.join() will be automatically formatted to be compatible with Linux, MacOS and Windows systems
    // The ".." means that we are going out of the __dirname path in order to enter the /views folder
    //res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));

    // alternative using the path.js util
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));

});


module.exports = router;
