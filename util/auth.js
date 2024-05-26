const bcrypt = require('bcrypt');

exports.hashedPassword = (password) => {
    return bcrypt.hash(password, 10);
}

exports.comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed);
}

exports.protect = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).redirect("/login");
    }
    next();
}