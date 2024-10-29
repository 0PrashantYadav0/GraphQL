const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
// const { default: axios } = require('axios');

async function startServer() {
    const app = express();

    const { Todos } = require('./data/Todos');
    const { User } = require('./data/User');

    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                address: String!
                phone: String!
                website: String!
                company: String!
            },
            type Todo {
                user: User
                id: ID!
                title: String!
                completed: Boolean
            },
            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id : ID!): User
            },
        `,
        resolvers: {
            Todo: {
                // user : async (todo) => {
                //     return (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
                // }
                user : async (todo) => {
                    return User.find(user => user.id === todo.userId)
                }
            },
            Query: {
                // getTodos: async () => {
                //     return (await axios.get("https://jsonplaceholder.typicode.com/todos")).data
                // },
                // getAllUsers: async () => {
                //     return (await axios.get("https://jsonplaceholder.typicode.com/users")).data
                // },
                // getUser: async (_, { id }) => {
                //     return (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
                // }
                getTodos: () => Todos,
                getAllUsers: () => User,
                getUser: (_, { id }) => User.find(user => user.id === id)
            },
        },
    });

    app.use(cors());
    app.use(bodyParser.json());

    await server.start();

    app.use("/graphql", expressMiddleware(server));
    app.listen(8000, () => {
        console.log('Server is running on port 8000');
    });
}

startServer();