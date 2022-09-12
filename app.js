const express = require('express');
require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/resolvers');
const models = require('./models/user');
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { models },
});

server
    .listen()
    .then(({ url }) => console.log(`Server is running on localhost:${process.env.PORT}`));
