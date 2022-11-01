import {Args, Authorized, Ctx, Query, Resolver} from "type-graphql";
import {LoginInput, SignUpInput} from "./authObjectTypes/auth.input";
import Error from "../../middlewares/error.middleware"
import authServices, {IRegister} from "../../services/auth.services";
import {LoginOutput, MeOutput} from "./authObjectTypes/auth.output";

@Resolver()
export default class AuthResolver {
    @Query(() => LoginOutput)
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

    @Query(() => MeOutput)
    @Authorized()
    async Me(@Ctx() {userInfo}: any) {
        try {
            const {data, error} = await authServices.me(userInfo.email);
            if (error) throw new Error(error);
            return data;
        } catch ({message, code}) {
            throw new Error(message, code);
        }
    }
}