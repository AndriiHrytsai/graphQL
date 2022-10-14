const express = require('express');
const { createServer } = require('http');
require('dotenv').config();
const app = express();
const { apiRouter } = require('./routes');
const { ApolloServer } = require('apollo-server-express');
const { schema, context } = require('./graphql/schema');
const session = require('express-session');
const passport = require('passport');
const { graphqlUploadExpress } = require('graphql-upload');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const { execute, subscribe } = require('graphql');

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
app.use(
  graphqlUploadExpress({
    maxFieldSize: process.env.MAXIMUM_UPLOAD_FILE_SIZE,
    maxFiles: process.env.MAXIMUM_NUMBER_OF_UPLOADED_FILES,
  }),
);

const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const server = new ApolloServer({ schema, context });

server.start().then(() => {
  server.applyMiddleware({ app });
});

httpServer.listen({ port: process.env.PORT }, () => {
  console.log(
    `🚀 Query endpoint ready at http://localhost:${process.env.PORT}${server.graphqlPath}`,
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${process.env.PORT}${server.graphqlPath}`,
  );
  useServer({ schema, execute, subscribe }, wsServer);
});
