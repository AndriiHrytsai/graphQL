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
  forgotPasswordToken: () => {
    return JWT.sign({}, process.env.JWT_FORGOT_PASSWORD_SECRET, {
      expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRATION_TIME,
    });
  },
};

const verifyToken = {
  token: (token) => {
    let decode;
    try {
      decode = JWT.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return null;
    }
    return decode;
  },
};

module.exports = {
  user,
  verifyToken,
};
