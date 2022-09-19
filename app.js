const express = require('express');
require('dotenv').config();
const app = express();
const { apiRouter } = require('./routes');
// const { ApolloServer } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/schema');
const session = require('express-session');
const passport = require('passport');

const dbObj = require('./models');
const db = dbObj.sequelize;
db.sync({})
  .then(() => {
    console.log(
      '\x1b[44m%s\x1b[0m',
      'Connection has been established successfully.',
    );
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'some-secret-string',
    cookie: { secure: true },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', apiRouter);

const server = new ApolloServer(schema);

server.start().then((res) => {
  server.applyMiddleware({ app });
  app.listen({ port: process.env.PORT }, () =>
    console.log(`Now browse to ${process.env.PORT}` + server.graphqlPath),
  );
});
