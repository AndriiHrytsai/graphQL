const router = require('express').Router();
const authRouter = require('./auth.router');

router.use('/', authRouter);

module.exports = router;
