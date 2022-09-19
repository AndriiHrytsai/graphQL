const router = require('express').Router();
const passport = require('passport');
const models = require('../models');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const { SevenBoom } = require('graphql-apollo-errors');
const { tokenHelper } = require('../helpers');

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
  async (req, res, next) => {
    const {
      email,
      name: { givenName: first_name, familyName: last_name },
    } = req.user;
    const getUser = await models.userModel.findOne({
      where: { email: email },
    });
    if (getUser) {
      throw SevenBoom.conflict('This email already exist');
    }
    const user = await models.userModel.create({
      first_name,
      last_name,
      email,
      password: await bcrypt.hash(
        generator.generate({ length: 8, numbers: true }),
        10,
      ),
    });
    const access_token = tokenHelper.user.accessToken(user.id, user.email);
    res.json(access_token);
  },
);

module.exports = router;
