const User = require('../models/user');
const {hashedPassword, comparePassword} = require('../util/auth');
const {transport} = require('../util/sendgrid_email');
const crypto = require('crypto');

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
                        res.redirect('/');
                        return transport.sendMail({
                            to: email,
                            from: "nashj760@gmail.com",
                            subject: "Sign up",
                            html: "<h1>Thanks for signing up!</h1>"
                        });
                    });
            }
        })
        .catch(error => {console.log(error)})
}

exports.getReset = (req, res) => {
    res.render('templates/reset', {
        pageTitle: 'Reset Password',
        path: "/reset",
        errorMessage: req.flash('error')
    });
}

exports.postReset = (req, res) => {
    crypto.randomBytes(16, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.status(500).redirect("/reset");
        }
        const token = buffer.toString("hex");
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'Invalid email.');
                    return res.status(401).redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
                return user.save()
                    .then(result => {
                        res.redirect("/");
                        return transport.sendMail({
                            to: req.body.email,
                            from: "nashj760@gmail.com",
                            subject: "Reset Password",
                            html: `
                                <p>You requested a Password Reset</p>
                                <p>Click this link to reset the password</p>
                                <a href="http://localhost:3000/reset-password/${token}">RESET</a>
                                `
                        });
                    });
            })
            .catch(error => {console.log(error);});
    });
}

exports.getResetPassword = (req, res) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gte: Date.now()}})
        .then(user => {
            if (!user) {
                req.flash('error', 'Reset link is expired. Try again.');
                return res.status(401).redirect('/reset');
            }
            res.render('templates/reset-password', {
                pageTitle: 'Reset Password',
                path: "/reset-password",
                errorMessage: req.flash('error'),
                token: token,
                userId: user._id.toString()
            });
        })
        .catch(error => {console.log(error);});
}

exports.postResetPassword = async (req, res ) => {
    const userId = req.body.userId;
    const newPassword = await hashedPassword(req.body.password1);
    const token = req.params.token;
    User.findOneAndUpdate(
        {_id: userId, resetToken: token, resetTokenExpiration: {$gte: Date.now()}},
        {password: newPassword, resetTokenExpiration: Date.now()})
        .then(user => {
            if (!user){
                req.flash('error', 'Invalid inputs');
                return res.redirect('/login');
            } else {
                res.redirect("/login");
            }
        })
        .catch(error => {console.log(error);});
}