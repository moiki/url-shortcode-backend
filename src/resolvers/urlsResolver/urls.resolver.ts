import {Arg, Authorized, Mutation, Query, Resolver} from "type-graphql";
import Error from "../../middlewares/error.middleware";
import urlsServices from "../../services/urls.services";
import {UrlTableOutput} from "./urlsObjectTypes/urls.output";

@Resolver()
export default class UrlsResolver {

    @Mutation(()=> String)
    @Authorized()
    async saveUrl(@Arg("url") url: string) {
        try {
            const sht = await urlsServices.SaveUrlService(url);
            if (sht.error) {
                throw new Error(sht.error)
            }
            return sht.data;
        } catch ({message, code}) {
            throw new Error(message, code);
        }
    }

    @Query(()=> UrlTableOutput)
    @Authorized()
    async listUrls(
        @Arg("page") page: number = 1,
        @Arg("perPage") perPage: number = 10,
    ) {
        try {
            const {data, error} = await urlsServices.ListUrls(page,perPage);
            if (error) {
                throw new Error(error)
            }
            const result: UrlTableOutput = {
                total: data.total || 0,
                docs: data.docs || []
            }
            return result
        } catch ({message, code}) {
            throw new Error(message, code);
        }
    }
}