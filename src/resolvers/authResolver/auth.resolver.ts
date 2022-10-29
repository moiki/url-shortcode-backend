import {Args, Authorized, Query, Resolver} from "type-graphql";
import {LoginInput, SignUpInput} from "./authObjectTypes/auth.input";
import Error from "../../middlewares/error.middleware"
import authServices, {IRegister} from "../../services/auth.services";
import {LoginOutput} from "./authObjectTypes/auth.output";

@Resolver()
export default class AuthResolver {
    @Query(() => LoginOutput)
    @Authorized()
    async Login(@Args() {email, password}: LoginInput) {
        try {
            const {data, error} = await authServices.UserLogin(email, password);
            if (error) throw new Error(error);
            const result: LoginOutput = {
                token: data?.token || "",
                username: data?.username || ""
            }
            return result;
        } catch ({message, code}) {
            throw new Error(message, code);
        }
    }

    @Query(() => Boolean)
    @Authorized()
    async SignUp(@Args() {email, password, username}: SignUpInput) {
        try {
            const registerBody: IRegister = {
                email,
                password,
                username
            }
            const {error} = await authServices.UserSignUp(registerBody);
            if (error) throw new Error(error);

            return true;
        } catch ({message, code}) {
            throw new Error(message, code);
        }
    }
}