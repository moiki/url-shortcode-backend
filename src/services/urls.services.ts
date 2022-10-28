import {getRandomHash, isNullOrWhitespace, validateUrl} from "../helpers";
import {UrlModel, UrlSchemaModel} from "../db/models/url.model";
import configCommon from "../common/config.common";

const {base_url} = configCommon;

async function SaveUrlService(url: string) {
    try {
        // Validate if input is a well formatted url
        if (isNullOrWhitespace(url) || !validateUrl(url)) return { error: "Not a valid url", data: null }
        // validate if url already exists
        const lookIfExist = await UrlModel.exists({full_url: url});
        if (lookIfExist) return {error: "Url already exists!", data: null}

        const shortcode = getRandomHash();
        const newUrl: UrlSchemaModel = {
            full_url: url,
            shortcode_url: `${base_url}/${shortcode}`,
            visits_quantity: 0
        }
        await UrlModel.create(newUrl);
        return {
            data: newUrl.shortcode_url
        }

    } catch (error) {
        return {error: error.message, data: null}
    }
}

export default {
    SaveUrlService
}