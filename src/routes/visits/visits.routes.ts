import Express from "express";
import urlsServices from "../../services/urls.services";

export default (app: Express.Application, BASE_URL: string) => {
    const router = Express.Router();
    const path = `/`;
    app.use(path, router);

    router.get("/:code", async (req,res,next) => {
        try {
            const code = req.params.code;
            const result = await urlsServices.SaveVisitRecord(code);
            if (result.error) res.status(401).json(result);
            if(!result.redirect) res.status(401).json({error: "url is missing!"});

            res.redirect(String(result.redirect));
        } catch (e) {
            res.status(500).json({result: e})
        }
    })
}