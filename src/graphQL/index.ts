import {buildSchema} from "type-graphql";
import {resolvers} from "../resolvers";
import authChecker from "../middlewares/auth.middleware";
import {ApolloServer} from "apollo-server-express";
import {gray, red} from "chalk";
import express from "express";
import cors from "cors";
const contextService = require("request-context");
 async function CreateGraphQLServer() {
     // Create Schema
     const schema = await buildSchema({
         resolvers,
         authChecker,
     });
     // Create apollo server once setup has completed
     return  new ApolloServer({
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
 }

async function CreateExpressGraphQLServer() {
    const app = express();
    try {
        app.use(contextService.middleware("req"));
        app.set('trust proxy', true);
        app.use(cors());
        const server = await CreateGraphQLServer()
        await server.start();
        server.applyMiddleware({ app });
        return {app, error: null};
    } catch (error) {
        console.log(error.message)
        return {app, error: error.message};
    }
}
export default {
    CreateExpressGraphQLServer
}