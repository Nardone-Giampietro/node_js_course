const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid");

exports.transport = nodemailer.createTransport(
    sendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);
