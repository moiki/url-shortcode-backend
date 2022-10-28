import 'reflect-metadata';
import express, { json } from 'express';
import cors from 'cors';
import { cyan, red, green } from 'chalk';
import routes from './routes';
import {MongooseConnection} from "./db/mongodb.connection";
import configCommon from "./common/config.common";

// Get the necessary env variables
const { port } = configCommon;

(async () => {
    try {
        // Create express app
        const app = express();

        // Get the left-most ip from the X-Forwarded-* header
        app.set('trust proxy', true);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());

        MongooseConnection().then(() => console.log(green(`MongoDB connection OK!`)));
        // call routes
        routes.urlsRoutes(app, 'api/v1');
        // listen to port
        app.listen(port, () =>
        console.log(cyan(`🚀 Server is flying on http://localhost:${port}/api/v1 🚀`)),
        );
    } catch ({ message, code }) {
        console.log(red(message));
        //	throw new Error(message, code);
    }
})();
