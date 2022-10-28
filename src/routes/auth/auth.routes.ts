import Express from "express";
import authServices, {IRegister} from "../../services/auth.services";

export default (app: Express.Application, BASE_URL: string) => {
    const router = Express.Router();
    const path = `/${BASE_URL}/account`;
    app.use(path, router);

    router.post("/login", async (req, res, next)=> {
        try {
            const {email, password} = req.body;
            const {data, error} = await authServices.UserLogin(email, password);
            if (error) res.status(400).json({error})

            res.json(data);

        }catch (e) {
            res.status(500).json({result: e})
        }
    });

    router.post("/signup", async (req, res, next)=> {
        try {
            const {body} = req;
            const newUser: IRegister = {
                email: body.email,
                password: body.password,
                username: body.username
            }
            const {error} = await authServices.UserSignUp(newUser);
            if (error) res.status(400).json({error})

            res.json({message: "User created successfully!"});

        }catch (e) {
            res.status(500).json({result: e})
        }
    });
}