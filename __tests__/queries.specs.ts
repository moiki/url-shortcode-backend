import "reflect-metadata";
import CreateGraphQLServer from "../src/graphQL";
import {gql} from "apollo-server-express";

it('should return and object with Pong!', async function () {
    const server = await CreateGraphQLServer()
    const {data} = await server.executeOperation({
        query: gql`
        query {
            Ping
        }`, })
    expect(data).toMatchObject({Ping: "Pong!"})
});