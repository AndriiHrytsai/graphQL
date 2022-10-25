const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CB,
      profileFields: ['id', 'name', 'email', 'picture.type(large)', 'locale'],
    },
    function (token, tokenSecret, profile, cb) {
      return cb(null, profile);
    },
  ),
);
module.exports = passport;
