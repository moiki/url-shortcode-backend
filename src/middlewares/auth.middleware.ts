import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import configCommon from "../common/config.common";

export const SECRET_KEY: Secret = configCommon.secret_key;

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        console.log(err.message)
        res.status(401).send({message:'Please authenticate'});
    }
};