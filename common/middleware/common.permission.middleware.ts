import express from 'express';
import { PermissionFlag, Role } from './common.permissionflag.enum';
import debug from 'debug';

const log: debug.IDebugger = debug('app:common-permission-middleware');

class CommonPermissionMiddleware {
    // permissionFlagRequired( requiredPermissionFlag: PermissionFlag, role?: string) {
    /**
     * 
     * @param requiredPermissionFlag 
     * @param requiredRoles 
     * @returns void
     */
    permissionFlagRequired(requiredPermissionFlag: PermissionFlag[], requiredRoles?: string[]) {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            try {
                const userPermissionFlags = parseInt(
                    res.locals.jwt.permissionFlags
                );

                const userRole = res.locals.jwt.role;

                if (requiredPermissionFlag.includes(userPermissionFlags) && (requiredRoles ? requiredRoles?.includes(userRole) : true)) {
                    next();
                } else {
                    res.status(403).send();
                }
            } catch (e) {
                log(e);
            }
        };
    }

    async onlySameUserOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
        const userRole = res.locals.jwt.role;

        if (
            req.params &&
            req.params.userId &&
            req.params.userId === res.locals.jwt.userId
        ) {
            return next();
        } else {
            // if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {

            if ([Role.ADMIN].includes(userRole)) {
                return next();
            } else {
                return res.status(403).send();
            }
        }
    }

    async onlySomeUserOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
        if (
            req.params &&
            req.params.userId &&
            req.params.userId === res.locals.jwt.userId
        ) {
            return next();
        } else {
            if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
                return next();
            } else {
                log(userPermissionFlags)
                return res.status(403).send();
            }
        }
    }
}

export default new CommonPermissionMiddleware();
