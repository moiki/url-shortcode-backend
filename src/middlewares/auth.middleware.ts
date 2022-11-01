import jwt, { Secret } from 'jsonwebtoken';
import { AuthChecker } from 'type-graphql';
import 'dotenv/config';
import Error from './error.middleware';
import configCommon from "../common/config.common";
const contextService = require('request-context');

export const SECRET_KEY: Secret = configCommon.secret_key;

const authChecker: AuthChecker<any> = async ({ context }) => {
    try {
        // Get headers from context
        let headers = context.req.headers;

        // Check that the headers contain the Authorization header
        if (!headers.authorization) {
            throw new Error('Missing Authorization Header', 401);
        }
        // Get the token from the authorization header
        const token = headers.authorization.split(' ')[1];
        // Validate the token
        const payload: any = jwt.verify(token, SECRET_KEY!);
        contextService.set('req:userInfo', JSON.parse(JSON.stringify(payload)));
        context.userInfo = JSON.parse(JSON.stringify(payload));
        return true;
    } catch ({ message, code }) {
        if (message === 'jwt expired') {
            const newCode = 401;
            throw new Error(message, newCode);
        }
        throw new Error(message, code);

    }
};

export default authChecker;
