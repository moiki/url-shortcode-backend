import {UserModel, UserSchemaModel} from "../db/models/user.model";
import {green} from "chalk";
import bcrypt from "bcrypt";
import configCommon from "../common/config.common";

async function SeedUser() {
    try {
        const userExistence = await UserModel.count();
        if (userExistence < 1) {
            const hashed = await bcrypt.hash("pa$$w0rd", configCommon.salt_rounds);
            const user: UserSchemaModel = {
                email: "default@user.com",
                username: "John Doe",
                password_hashed: hashed
            }
            await UserModel.create(user);
            console.log(green("Seed Executed!"))
        }
        return true;
    } catch (error) {
        console.log(error.message)
        return false
    }
}

export default {
    SeedUser
}