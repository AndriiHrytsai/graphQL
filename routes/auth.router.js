const router = require('express').Router();
const passport = require('passport');
const models = require('../models');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const { tokenHelper, mailHelper } = require('../helpers');

router.get('/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(
    req,
    res,
    next,
  );
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    const { email, given_name: first_name, family_name: last_name } = req.user;
    const getUser = await models.userModel.findOne({
      where: { email: email },
    });
    if (getUser) {
      const access_token = tokenHelper.user.accessToken(
        getUser.id,
        getUser.email,
      );
      res.json(access_token);
      return access_token;
    }
    const userPassword = generator.generate({ length: 8, numbers: true });
    await mailHelper.sendMail(email, 'Your generated password', {
      userName: first_name,
      password: userPassword,
    });

    const user = await models.userModel.create({
      first_name,
      last_name,
      email,
      password: await bcrypt.hash(userPassword, 10),
    });
    const access_token = tokenHelper.user.accessToken(user.id, user.email);
    res.json(access_token);
  },
);

module.exports = router;
