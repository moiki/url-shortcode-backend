import {Authorized, Query, Resolver} from "type-graphql";
import Error from "../../middlewares/error.middleware"

@Resolver()
export default class PingResolver {

    @Query(()=> String)
    async Ping() {
        try {
            return "Pong!";
        } catch ({ message, code }) {
            throw new Error(message, code);
        }
    }
}