import 'reflect-metadata';
import {cyan, red, green, gray} from 'chalk';
import routes from './routes';
import {MongooseConnection} from "./db/mongodb.connection";
import configCommon from "./common/config.common";
import graphQL from "./graphQL";
import SeedHelper from "./helpers/seed.helper";
// Get the necessary env variables
const { port } = configCommon;

(async () => {
    try {
        // Create middleware
        const {app} = await graphQL.CreateExpressGraphQLServer()
        routes.visitsRoutes(app, 'api/v1');

        MongooseConnection().then(() => console.log(green(`MongoDB connection OK!`)));
        await SeedHelper.SeedUser();
        // listen to port
        app.listen(port, () =>
        console.log(cyan(`🚀 Server is flying on http://localhost:${port}/graphql 🚀`)),
        );
    } catch ({ message, code }) {
        console.log(red(message));
        //	throw new Error(message, code);
    }
})();
