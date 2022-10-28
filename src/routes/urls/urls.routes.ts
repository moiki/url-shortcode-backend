import Express from "express";
import urlsServices from "../../services/urls.services";
import {AuthMiddleware} from "../../middlewares/auth.middleware";

export default (app: Express.Application, BASE_URL: string) => {
    const router = Express.Router();
    const path = `/${BASE_URL}/urls`;
    app.use(path, router);

    router.get("/", AuthMiddleware,async (req, res, next)=> {
        try {
            const urlList = await urlsServices.ListUrls();
            if (urlList.error) res.status(401).json({message: urlList.error});
            const [result] = urlList.data || [];
            res.send(result ? { data: result}: {data: null});
        }catch (e) {
            res.status(500).json({result: e})
        }
    });


    /**
     * POST api/v1/urls
     * Take the given url, generate its  shortcode version and save it
     */
    router.post("/", AuthMiddleware,async (req,res,next) => {
        try {
            const {url} = req.body;
            const sht = await urlsServices.SaveUrlService(url);
            if (sht.error) {
                res.status(401).json({result: sht.error})
            }
            res.status(200).json(sht);
        }catch (e) {
            res.status(500).json({result: e})
        }
    })
}