import "reflect-metadata";
import {gql} from "apollo-server-express";
import {MongooseConnection} from "../src/db/mongodb.connection";
import AuthServices from "../src/services/auth.services";
import {UrlTableOutput} from "../src/resolvers/urlsResolver/urlsObjectTypes/urls.output";
import request from 'supertest-graphql'
import {Express} from "express";
import graphQL from "../src/graphQL";
const mockTestForToken = {
    email: "moises@gmail.com",
    password: "1234"
}

describe("Testing correct query behavior", ()=> {
    let app: Express;
    beforeAll(async ()=>{
        const server = await graphQL.CreateExpressGraphQLServer();
        app = server.app;
        await MongooseConnection()
    })
    const mockToken = AuthServices.GenerateToken(mockTestForToken);

    it('should return and object with Pong!', async function () {
        const {data} = await request(app)
            .query(gql`
            query {
                Ping
            }`)
        expect(data).toMatchObject({Ping: "Pong!"})
    });

    it('should return and object with Pong!', async function () {
        const {data} = await request(app)
            .query(gql`
            query($page: Int! $perPage: Int! ){
                ListUrls(page: $page perPage: $perPage) {
                    docs {
                        original_url
                        short_url
                        visits_quantity
                    }
                    total
                }
            }`).auth(mockToken.token, {type: "bearer"})
        .variables({page: 1, perPage: 10})
        expect(data).toMatchObject(new UrlTableOutput())
    });
})