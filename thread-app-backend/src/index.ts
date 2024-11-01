import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const PORT = 8000;

    app.use(express.json());

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `, // Schema
        resolvers: {
            Query: {
                hello: () => 'Hello World',
                say: (_, { name }) => `Hello ${name}`
            }
        }, // Resolvers
    });

    await gqlServer.start();

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

init();