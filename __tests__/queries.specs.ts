import "reflect-metadata";
import {gql} from "apollo-server-express";
import {MongooseConnection} from "../src/db/mongodb.connection";
import AuthServices from "../src/services/auth.services";
import {UrlTableOutput} from "../src/resolvers/urlsResolver/urlsObjectTypes/urls.output";
import request from 'supertest-graphql'
import {Express} from "express";
import graphQL from "../src/graphQL";
import mongoose from "@typegoose/typegoose";
import SeedHelper from "../src/helpers/seed.helper";

const mockTestForToken = {
    email: "default@user.com",
    password: "pa$$w0rd"
}

describe("Testing correct query behavior", () => {
    let app: Express;
    let conn: typeof mongoose.mongoose
    beforeAll(async () => {
        conn = await MongooseConnection()
        await SeedHelper.SeedUser();
        const server = await graphQL.CreateExpressGraphQLServer();
        app = server.app;
    })
    afterAll(async () => await conn.disconnect())
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

    it('should return simple user data', async function () {
        const {data} = await request(app)
        .query(gql`
            query {
                Me {
                    username
                    email
                }
            }`).auth(mockToken.token, {type: "bearer"})
        expect(data.Me.email).toBe(mockTestForToken.email)
    });

    it('should return a string for shortcode url', async function () {
        const {data} = await request(app)
        .query(gql`
            mutation SaveUrl($url: String!){
                SaveUrl(url: $url)
            }`).auth(mockToken.token, {type: "bearer"})
        .variables({url: "https://sheet.google.com"})
        expect(data.SaveUrl).toContain("http://localhost");
    })
});