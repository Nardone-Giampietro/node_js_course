const User = require('../models/user');
const {hashedPassword, comparePassword} = require('../util/auth');

exports.getLogin = (req, res) => {
    res.render('templates/login',{
        pageTitle: 'Login',
        path: "/login",
        errorMessage: req.flash('error')
    });
};

exports.postLogin = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(async user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.status(400).redirect('/login');
            } else {
                const isValid = await comparePassword(req.body.password, user.password);
                if (isValid) {
                    req.session.user = {
                        _id: user._id,
                        email: user.email,
                    };
                    req.session.isLoggedIn = true;
                    req.session.save(() => {
                        res.status(200).redirect('/')
                    });
                } else {
                    req.flash('error', 'Invalid email or password.');
                    return res.status(400).redirect('/login');
                }
            }
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

exports.getSignup = (req, res) => {
    res.render('templates/signup', {
        pageTitle: 'Signup',
        path: "/signup",
        errorMessage: req.flash('error')
    });
}

exports.postSignup = (req, res) => {
    const email = req.body.email;
    const password1 = req.body.password1;
    const password2 = req.body.password2;
    User.findOne({
        email: email
    })
        .then(async user => {
            if (user) {
                req.flash('error', 'User already exist.');
                return res.redirect(`/signup`);
            } else {
                const newUser = new User({
                    email: email,
                    password: await hashedPassword(password1),
                    cart: {
                        items: []
                    }
                });
                newUser.save()
                    .then(result => {
                        return res.redirect('/');
                    });
            }
        })
        .catch(error => {console.log(error)})
}