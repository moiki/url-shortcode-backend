import "reflect-metadata";
import CreateGraphQLServer from "../src/graphQL";
import {gql} from "apollo-server-express";

it('should complete the login process', async function () {
    const server = await CreateGraphQLServer()
    const executeLoginQuery = await server.executeOperation({
        query: gql`
        query {
            Ping
        }`})
    expect(executeLoginQuery).toBe("Pong!")
});