exports.get404 = (req, res, next) => {
    res.status(404).render('templates/404', { pageTitle: 'Page Not Found' });
};