import "reflect-metadata";
import CreateGraphQLServer from "../src/graphQL";
import {gql} from "apollo-server-express";
import {MongooseConnection} from "../src/db/mongodb.connection";
import AuthServices from "../src/services/auth.services";
import {UrlTableOutput} from "../src/resolvers/urlsResolver/urlsObjectTypes/urls.output";

const mockTestForToken = {
    email: "moises@gmail.com",
    password: "1234"
}

describe("Testing correct query behavior", ()=> {
    beforeAll(MongooseConnection)
    const mockToken = AuthServices.GenerateToken(mockTestForToken);

    it('should return and object with Pong!', async function () {
        const server = await CreateGraphQLServer()
        const {data} = await server.executeOperation({
            query: gql`
                query {
                    Ping
                }`,
        }, )
        expect(data).toMatchObject({Ping: "Pong!"})
    });

    it('should return and object with Pong!', async function () {
        const server = await CreateGraphQLServer()
        const {data} = await server.executeOperation({
            query: gql`
                query {
                    Ping
                }`,
        })
        expect(data).toMatchObject(new UrlTableOutput())
    });
})