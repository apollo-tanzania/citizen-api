import express from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userService from '../service/user';

const log: debug.IDebugger = debug('app:auth-controller');

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;
// const tokenExpirationInSeconds = 36000;
const tokenExpirationInSeconds = '60s';


class AuthController {
    async createJWT(req: express.Request, res: express.Response) {
        try {
            const refreshId = req.body.userId + jwtSecret;
            const salt = crypto.createSecretKey(crypto.randomBytes(16));
            const hash = crypto
                .createHmac('sha512', salt)
                .update(refreshId)
                .digest('base64');
            req.body.refreshKey = salt.export();
            const token = jwt.sign(req.body, jwtSecret, {
                expiresIn: tokenExpirationInSeconds,
            });
            return res
                .status(201)
                .send({ accessToken: token, refreshToken: hash });
        } catch (err) {
            log('createJWT error: %O', err);
            return res.status(500).send();
        }
    }

    async getAuthenticatedUser(req: express.Request, res: express.Response) {
        try {
            const user = await userService.readById(res.locals.jwt.userId)
            if(!user) throw new Error("User not found")
            const { firstName, middleName, lastName, role, enabled } = user 
            return res
                .status(200)
                .send({
                    userId: res.locals.jwt.userId,
                    email: res.locals.jwt.email,
                    displayName: `${firstName} ${lastName}`,
                    firstName,
                    middleName,
                    lastName,
                    role: role,
                    userEnabled: enabled
                });
        } catch (err) {
            log('createJWT error: %O', err);
            return res.status(500).send();
        }
    }
}

export default new AuthController();
