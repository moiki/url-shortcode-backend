import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: { timestamps: true, collection: "accountUsers" },
})
export class UserSchemaModel {
    @prop({ required: true, text: true, index: true })
    username: string;

    @prop({ type: String, required: true, text: true, index: true })
    email: string;

    @prop({ type: String, required: true })
    password_hashed: string;

}

export const UserModel = getModelForClass(UserSchemaModel);
