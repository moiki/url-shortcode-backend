import {ObjectType, Field} from "type-graphql"

@ObjectType("UrlOutput")
export class UrlBodyOutput {
    @Field()
    original_url: string
    @Field()
    short_url: string
    @Field()
    visits_quantity: string
}

@ObjectType("UrlTableOutput")
export class UrlTableOutput {
    @Field()
    total: number
    @Field(()=>[UrlBodyOutput])
    docs: UrlBodyOutput[]
}