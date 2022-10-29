import {ArgsType, Field} from "type-graphql"

@ArgsType()
export class LoginInput {
    @Field()
    email: string
    @Field()
    password: string
}

@ArgsType()
export class SignUpInput {
    @Field()
    email: string
    @Field()
    username: string
    @Field()
    password: string
}