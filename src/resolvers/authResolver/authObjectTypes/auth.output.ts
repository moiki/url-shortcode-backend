import {ObjectType, Field} from "type-graphql"

@ObjectType("LoginOutput")
export class LoginOutput {
    @Field()
    token: string
    @Field()
    username: string
}

@ObjectType("MeOutput")
export class MeOutput {
    @Field()
    email: string
    @Field()
    username: string
}