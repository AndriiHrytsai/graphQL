const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_ID,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: process.env.TWITTER_CB,
    },
    function (token, tokenSecret, profile, cb) {
      return cb(null, profile);
    },
  ),
);

module.exports = passport;
