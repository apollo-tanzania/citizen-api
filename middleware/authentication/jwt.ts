import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../../common/types/jwt';
import usersService from '../../service/user';
import { log } from 'winston';
import { CreateUserDto } from '../../dto/createUser';
import { Role } from '../../common/middleware/common.permissionflag.enum';
import { extractUserPermission } from './utils';

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;

class JwtMiddleware {
    verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.refreshToken) {
            return next();
        } else {
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] });
        }
    }

    async validRefreshNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await usersService.getUserByEmailWithPassword(
            res.locals.jwt.email
        );

        if (!user) res.status(500).send({ message: 'Invalid user' })

        const userPermissionFlags = await extractUserPermission(user.email, user.role)

        const salt = crypto.createSecretKey(
            Buffer.from(res.locals.jwt.refreshKey.data)
        );
        const hash = crypto
            .createHmac('sha512', salt)
            .update(res.locals.jwt.userId + jwtSecret)
            .digest('base64');
        if (hash === req.body.refreshToken) {
            req.body = {
                userId: user._id,
                email: user.email,
                permissionFlags: userPermissionFlags,
            };
            return next();
        } else {
            return res.status(400).send({ message: 'Invalid refresh token' });
        }
    }

    validJWTNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    res.locals.jwt = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt;
                    next();
                }
            } catch (err) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    }

    async extractCurrentUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.authorizedBy = "";
        if (req.headers['authorization']) {
            const authorization = req.headers['authorization'].split(' ');
            try {
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    let jwtInfo = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt

                    req.body.authorizedBy = jwtInfo.userId;
                    next();
                }
            } catch (error) {
                return res.status(401).send(error);
            }

        } else {
            return res.status(401).send();
        }
    }

    async extractCurrentUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.currentUser = {};
        if (req.headers['authorization']) {
            const authorization = req.headers['authorization'].split(' ');
            try {
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    let jwtInfo = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt

                    req.body.currentUser = jwtInfo;
                    next();
                }
            } catch (error) {
                return res.status(401).send(error);
            }

        } else {
            return res.status(401).send();
        }
    }

}

export default new JwtMiddleware();
