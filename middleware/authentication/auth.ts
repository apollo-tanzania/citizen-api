import express from 'express';
import userService from '../../service/user';
import adminService from '../../service/admin'
import * as argon2 from 'argon2';
import lawEnforcementService from '../../service/lawEnforcement';

class AuthMiddleware {
    async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await userService.getUserByEmailWithPassword(
            req.body.email
        );
        if (user) {

            if (user.role === 'admin') {
                const admin: any = await adminService.getAdminByEmail(
                    req.body.email
                );
                if (admin) {
                    user.permissionFlags = admin.permissionFlags;
                }
            }

            if (user.role === 'law enforcement') {
                const lawEnforcement: any = await lawEnforcementService.getLawEnforcementByEmail(
                    req.body.email
                );
                if (lawEnforcement) {
                    user.permissionFlags = lawEnforcement.permissionFlags;
                }
            }


            const passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    role: user.role,
                    permissionFlags: user.permissionFlags,
                };
                return next();
            }
        }
        res.status(400).send({ errors: ['Invalid email and/or password'] });
    }
}

export default new AuthMiddleware();
