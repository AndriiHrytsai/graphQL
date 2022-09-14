const express = require('express');
require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const schema = require('./graphql/schema');

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

const server = new ApolloServer(schema);
server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on localhost:${process.env.PORT}`),
    );
