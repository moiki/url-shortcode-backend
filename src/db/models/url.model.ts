import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: { timestamps: true, collection: "url-visited" },
})
export class UrlSchemaModel {
    @prop({ required: true, text: true, index: true })
    full_url: String;

    @prop({ type: String, required: false, text: true, index: true })
    shortcode_url: String;

    @prop({ required: true, index: true, default: 1 })
    visits_quantity: number;
}

export const UrlModel = getModelForClass(UrlSchemaModel);
