import bcrypt from 'bcrypt';
import jwt, {Secret, JwtPayload} from 'jsonwebtoken';
import {UserModel, UserSchemaModel} from "../db/models/user.model";
import configCommon from "../common/config.common";
import {generateKey} from "crypto";
import {isNullOrWhitespace, validateEmail} from "../helpers";
import {MeOutput} from "../resolvers/authResolver/authObjectTypes/auth.output";

export interface IRegister {
    username: string;
    email: string;
    password: string;
}

async function UserLogin(email: string, password: string) {
    try {
        const findUser = await UserModel.findOne({email});
        if (!findUser) return {error: "Invalid Credentials: User not found!"}

        const isMatch = bcrypt.compareSync(password, findUser.password_hashed);
        if (!isMatch) return {error: "Invalid Credentials: Password is not correct!"}
        const getToken = GenerateToken(findUser);
        return {
            data: {
                token: getToken.token,
                username: findUser.username
            }, error: null
        };
    } catch (error) {
        console.log(error.message)
        return {error: error.message, data: null}
    }
}

async function UserSignUp(newUser: IRegister) {
    try {
        if (!validateNewUser(newUser)) return { error: "The user has invalid parameters!" };
        const findUser = await UserModel.findOne({email: newUser.email});
        if (findUser) return {error: "this user already Exists!"}
        const hashed = await bcrypt.hash(newUser.password, configCommon.salt_rounds);
        const user: UserSchemaModel = {
            email: newUser.email,
            username: newUser.username,
            password_hashed: hashed
        }
        await UserModel.create(user);
        return { error: null }
    } catch (error) {
        console.log(error.message)
        return {error: error.message}
    }
}

async function me(email: string) {
    try {
        const me = await UserModel.findOne({email});
        if (!me) return { error: "User is no longer available" }
        const meResult: MeOutput = {
            username: me.username, email: me.email
        }
        return { data: meResult, error: null }
    } catch (error) {
        console.log(error.message)
        return {error: error.message, data: null}
    }
}

function GenerateToken(data: any) {
    const token = jwt.sign({_id: data._id?.toString(), name: data.username, email: data.email}, configCommon.secret_key, {
        expiresIn: configCommon.expiration_token,
    });

    return {token: token};
}

const validateNewUser = (user: IRegister) => {
    for (const userKey of Object.entries(user)) {
        if (isNullOrWhitespace(String(userKey[1]))) return false;
    }
    if (!validateEmail(user.email)) return false;
    return true;
}

export default {
    UserLogin,
    UserSignUp,
    GenerateToken,
    me
}