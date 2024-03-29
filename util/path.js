const path = require("path");

// this will give the path of the file that is responsible for the execution of all the server, so app.js
module.exports = path.dirname(require.main.filename);