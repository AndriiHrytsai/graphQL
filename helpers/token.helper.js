const JWT = require('jsonwebtoken');

const user = {
    accessToken: (userId, email) => {
        return JWT.sign(
            {
                sub: userId,
                email: email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION_TIME,
            },
        );
    },
};

module.exports = {
    user,
};
