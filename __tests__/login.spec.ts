import "reflect-metadata";
import CreateGraphQLServer from "../src/graphQL";
import {gql} from "apollo-server-express";
import {LoginOutput} from "../src/resolvers/authResolver/authObjectTypes/auth.output";
import {MongooseConnection} from "../src/db/mongodb.connection";

describe("Login function test.", ()=> {
    beforeAll(MongooseConnection)

    it('should return LoginOutput', async function () {
        const variables = {
            email: "moises@gmail.com",
            password: "1234"
        }
        const server = await CreateGraphQLServer()
        const {data: dataSuccess} = await server.executeOperation({
            query: gql`
                query($page: Int! $perPage: Int! ){
                    ListUrls(page: $page perPage: $perPage) {
                        docs {
                            original_url
                            short_url
                            visits_quantity
                        }
                        total
                    }
                }`,
            variables: { page: 1, perPage: 10 },
        },
        )
        expect(dataSuccess).toMatchObject(new LoginOutput())
    });
})