const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const {body} = require('express-validator');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post('/login',
    [
    body("email", "Invalid email")
        .notEmpty()
        .isEmail()
        .normalizeEmail(),
    body("email")
        .custom(async (value) => {
            const user = await User.findOne({email: value});
            if (!user) {
                throw new Error("User not found");
            }
            return true;
        }),
    body("password", "Invalid Password")
        .notEmpty()
        .trim()
        .isLength({ min: 6})],
    authController.postLogin);
router.post('/logout', authController.postLogout);
router.get("/signup", authController.getSignup);
router.post("/signup",
    [
    body("email")
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid Email")
        .custom(async (value) => {
            const user = await User.findOne({email: value});
            if (user) {
                throw new Error("User already exist");
            }
            return true;
        }),
    body("password1")
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 6 })
        .withMessage("Invalid Password"),
    body("password2")
        .trim()
        .custom((value, {req}) =>{
            const check = value.toString() === req.body.password1.toString();
            if (!check) {
                throw new Error("Passwords must be equals");
            }
            return true;
        })],
    authController.postSignup);
router.get("/reset", authController.getReset);
router.get("/reset-password/:token", authController.getResetPassword);
router.post("/reset-password/:token", authController.postResetPassword);
router.post("/reset", authController.postReset);

module.exports = router;