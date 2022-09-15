const nodemailer = require('nodemailer');
const EmailTemplates = require('email-templates');
const path = require('path');
const { SevenBoom } = require('graphql-apollo-errors');

const templateInfo = require('../email.templates/index');

const templateParser = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), 'email.templates'),
    },
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendMail = async (userMail, action, context = {}) => {
    const templateToSend = templateInfo[action];

    if (!templateToSend) {
        throw SevenBoom.conflict('Wrong template');
    }

    const html = await templateParser.render(
        templateToSend.templateName,
        context,
    );

    return transporter.sendMail({
        from: 'andriy hrytsay',
        to: userMail,
        subject: templateToSend.subject,
        html,
    });
};

module.exports = {
    sendMail,
};
