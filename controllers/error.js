exports.get404 = (req, res, next) => {
    res.status(404).render('templates/404', {
        pageTitle: 'Page Not Found',
        path: "/404"
    });
};

exports.get500 = (req, res, next) => {
    res.status(500).render('templates/500', {
        pageTitle: 'Server Error',
        path: "/500"
    })
}