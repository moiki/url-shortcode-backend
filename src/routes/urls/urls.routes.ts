import Express from "express";
import urlsServices from "../../services/urls.services";

export default (app: Express.Application, BASE_URL: string) => {
    const router = Express.Router();
    const path = `/${BASE_URL}/urls`;
    app.use(path, router);

    router.get("/", (req, res, next)=> {
        res.send({message: "Hello World!"})
    });

    router.post("/", async (req,res,next) => {
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