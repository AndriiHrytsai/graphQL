const router = require('express').Router();
const passport = require('passport');
const { oAuthHelper } = require('../helpers');
const passportFacebook = require('../passportStrategy/facebook');
const passportGoogle = require('../passportStrategy/google');
const passportTwitter = require('../passportStrategy/twitter');

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
    req.candidate = {
      first_name: first_name,
      last_name: last_name,
      email: email,
    };
    const access_token = await oAuthHelper(req.candidate);
    res.json(access_token);
  },
);

router.get('/facebook', (req, res, next) => {
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })(
    req,
    res,
    next,
  );
});

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res, next) => {
    req.candidate = {
      first_name: req.user?.name?.givenName,
      last_name: req.user?.name?.familyName,
      email: req.user?.emails?.[0]?.value,
    };

    const access_token = await oAuthHelper(req.candidate);
    res.json(access_token);
  },
);

router.get('/twitter', (req, res, next) => {
  passport.authenticate('twitter', { scope: ['user_profile'] })(req, res, next);
});

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  async (req, res) => {
    req.candidate = {
      first_name: req.user?.username,
      last_name: req.user?.displayName,
      email: req.body?.email || 'xazazxaz@gmail.com',
    };
    const access_token = await oAuthHelper(req.candidate);
    res.json(access_token);
  },
);

module.exports = router;
