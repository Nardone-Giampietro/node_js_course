exports.getLogin = (req, res) => {
    res.render('templates/login',{
        pageTitle: 'Login',
        path: "/login",
        isAuthenticated: req.isAuthenticated
    });
};

exports.postLogin = (req, res) => {
    res.cookie('token', "true");
    res.redirect('/');
}