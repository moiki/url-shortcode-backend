import "reflect-metadata";
import mongoose from "@typegoose/typegoose";
import {gql} from "apollo-server-express";
import {Express} from "express";
import graphQL from "../src/graphQL";
import request from 'supertest-graphql'
import {LoginOutput} from "../src/resolvers/authResolver/authObjectTypes/auth.output";
import {MongooseConnection} from "../src/db/mongodb.connection";
import SeedHelper from "../src/helpers/seed.helper";

const mockAuth = {
    email: "default@user.com",
    password: "pa$$w0rd"
}

describe("Login function test.", ()=> {
    let app: Express;
    let conn: typeof mongoose.mongoose
    beforeAll(async ()=>{
        conn= await MongooseConnection()
        await SeedHelper.SeedUser();
        const server = await graphQL.CreateExpressGraphQLServer();
        app = server.app;
    })
    afterAll(async ()=> await conn.disconnect())
    it('should return LoginOutput', async function () {
        const {data} = await request(app).query(gql`
            query ($email: String! $password: String!){
                Login(email: $email password: $password) {
                    token,
                    username
                }
            }`).variables(mockAuth)
        expect(data).toMatchObject(new LoginOutput())
    });
})