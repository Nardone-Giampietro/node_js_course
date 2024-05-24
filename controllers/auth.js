const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('templates/login',{
        pageTitle: 'Login',
        path: "/login",
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res) => {
    User.findOne({ email: req.body.email })
        .select({_id: 1, name: 1, email: 1})
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save()
        })
        .then(result => {
            res.redirect('/');
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/');
    });
}