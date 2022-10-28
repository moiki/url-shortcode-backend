import {getRandomHash, isNullOrWhitespace, validateUrl} from "../helpers";
import {UrlModel, UrlSchemaModel} from "../db/models/url.model";
import configCommon from "../common/config.common";

const {base_url} = configCommon;

async function SaveUrlService(url: string) {
    try {
        // Validate if input is a well formatted url
        if (isNullOrWhitespace(url) || !validateUrl(url)) return {error: "Not a valid url", data: null}
        // validate if url already exists
        const lookIfExist = await UrlModel.exists({original_url: url});
        console.log(lookIfExist)
        if (lookIfExist) return {error: "Url already exists!", data: null}

        const shortcode = getRandomHash();
        const newUrl: UrlSchemaModel = {
            original_url: url,
            shortcode: shortcode,
            base_url,
            visits_quantity: 0
        }
        await UrlModel.create(newUrl);
        return {
            data: `${newUrl.base_url}/${newUrl.shortcode}`
        }

    } catch (error) {
        return {error: error.message, data: null}
    }
}

async function SaveVisitRecord(code: string) {
    try {
        const myUrl = await UrlModel.findOneAndUpdate({shortcode: code}, {
            $inc: {visits_quantity: 1}
        })
        if (!myUrl) return {error: "Url does not exist."}
        return {
            redirect: `${myUrl.original_url}`,
            error: null
        }
    } catch (error) {
        console.log(error.message)
        return {
            error: error.message,
            redirect: null
        }
    }
}

async function ListUrls(page: number = 1, perPage: number = 10) {
    try {
        const $skip = (page - 1) * perPage;
        const $limit = perPage
        const pipeline: any[] = [
            {
                $facet: {
                    total: [{
                        $group: {
                            _id: null,
                            count: {$sum: 1}
                        }
                    },
                        {
                            $project: {_id: 0, count: 1}
                        }
                    ],
                    docs: [
                        {
                            $sort: { visits_quantity: -1 }
                        },
                        {
                            $skip
                        },
                        {
                            $limit
                        },
                        {
                            $project: {
                                _id: 0,
                                original_url: 1,
                                short_url: { $concat: ["$base_url","/","$shortcode"] },
                                visits_quantity: 1
                            }
                        }
                    ]
                }
            }
        ]
        const result = await UrlModel.aggregate(pipeline) || [];
        return {
            data: result,
            error: null
        };

    } catch (error) {
        console.log(error.message)
        return {
            error: error.message,
            data: null
        }
    }
}

export default {
    SaveUrlService,
    SaveVisitRecord,
    ListUrls
}