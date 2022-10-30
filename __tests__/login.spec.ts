import "reflect-metadata";
import CreateGraphQLServer from "../src/graphQL";
import {gql} from "apollo-server-express";

describe("Login function test.", ()=> {
    it('should return LoginOutput', async function () {
        const server = await CreateGraphQLServer()
        const {data} = await server.executeOperation({
            query: gql`
                query {
                    Login
                }`, })
        expect(data).toMatchObject({Ping: "Pong!"})
    });
})