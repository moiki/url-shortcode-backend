import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: { timestamps: true, collection: "url-visited" },
})
export class UrlSchemaModel {
    @prop({ required: true, text: true, index: true })
    original_url: string;

    @prop({ type: String, required: false, text: true, index: true })
    shortcode: string;

    @prop({ type: String, required: false, text: true, index: true })
    base_url: string;

    @prop({ required: true, index: true, default: 0 })
    visits_quantity: number;
}

export const UrlModel = getModelForClass(UrlSchemaModel);
