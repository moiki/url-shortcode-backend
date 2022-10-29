import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import {cyan, red, green, gray} from 'chalk';
import routes from './routes';
import {MongooseConnection} from "./db/mongodb.connection";
import configCommon from "./common/config.common";
import {buildSchema} from "type-graphql";
import authChecker from "./middlewares/auth.middleware"
import {ApolloServer} from "apollo-server-express";
import {resolvers} from "./resolvers";
const contextService = require("request-context");
// Get the necessary env variables
const { port } = configCommon;

(async () => {
    try {
        // Create express app
        const app = express();
        app.use(contextService.middleware("req"));
        // Get the left-most ip from the X-Forwarded-* header
        app.set('trust proxy', true);
        app.use(cors());
        // Create Schema
        const schema = await buildSchema({
            resolvers,
            authChecker,
        });

        // Create apollo server once setup has completed
        const server = new ApolloServer({
            context: ({ req, res }) => {
                return { req, res };
            },
            schema,
            formatError: (err) => {
                const message = err.message.toLowerCase();
                if (message.includes("argument validation error")) {

                    err.message = "argument validation error";
                    err.extensions!.code = "BAD_REQUEST";
                } else if (
                    message.includes("invalid signature") ||
                    message.includes("invalid token")
                ) {
                    err.message = "Invalid request";
                    err.extensions!.code = "UNAUTHENTICATED";
                }
                console.log(red(err.message), gray(err.extensions?.code));
                return err;
            },
        });

        routes.visitsRoutes(app, 'api/v1');
        // Create middleware
        await server.start()
        server.applyMiddleware({ app });

        MongooseConnection().then(() => console.log(green(`MongoDB connection OK!`)));
        // listen to port
        app.listen(port, () =>
        console.log(cyan(`🚀 Server is flying on http://localhost:${port}/graphql 🚀`)),
        );
    } catch ({ message, code }) {
        console.log(red(message));
        //	throw new Error(message, code);
    }
})();
