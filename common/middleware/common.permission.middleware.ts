import express from 'express';
import { PermissionFlag, Role } from './common.permissionflag.enum';
import debug from 'debug';
import checkIfIs32bitInteger from '../helpers/checkIfIs32bitIntenger';
import Long from 'long';

const log: debug.IDebugger = debug('app:common-permission-middleware');

class CommonPermissionMiddleware {
    // permissionFlagRequired( requiredPermissionFlag: PermissionFlag, role?: string) {
    /**
     * 
     * @param requiredPermissionFlag 
     * @param requiredRoles 
     * @returns void
     */
    // permissionFlagRequired(requiredPermissionFlag: PermissionFlag[], requiredRoles?: string[]) {
    //     return (
    //         req: express.Request,
    //         res: express.Response,
    //         next: express.NextFunction
    //     ) => {
    //         try {
    //             const userPermissionFlags = parseInt(
    //                 res.locals.jwt.permissionFlags
    //             );

    //             const userRole = res.locals.jwt.role;

    //             if (requiredPermissionFlag.includes(userPermissionFlags) && (requiredRoles ? requiredRoles?.includes(userRole) : true)) {
    //                 next();
    //             } else {
    //                 res.status(403).send();
    //             }
    //         } catch (e) {
    //             log(e);
    //         }
    //     };
    // }

    // permissionFlagRequired(requiredPermissionFlag: PermissionFlag[], requiredRoles?: string[]) {
    //     return (
    //         req: express.Request,
    //         res: express.Response,
    //         next: express.NextFunction
    //     ) => {
    //         try {
    //             const userPermissionFlags = parseInt(
    //                 res.locals.jwt.permissionFlags
    //             );

    //             const userRole = res.locals.jwt.role;

    //             if (requiredPermissionFlag.includes(userPermissionFlags) && (requiredRoles ? requiredRoles?.includes(userRole) : true)) {
    //                 next();
    //             } else {
    //                 res.status(403).send();
    //             }
    //         } catch (e) {
    //             log(e);
    //         }
    //     };
    // }
    permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            let permissionFlagLong;
            let userPermissionFlagsLong;

            try {
                const userPermissionFlags = parseInt(
                    res.locals.jwt.permissionFlags
                );

                 console.log({userPermissionFlags, requiredPermissionFlag})

                let checkResult = checkIfIs32bitInteger(requiredPermissionFlag)


                if (!checkResult) {
                    permissionFlagLong = Long.fromNumber(requiredPermissionFlag)
                    userPermissionFlagsLong = Long.fromNumber(userPermissionFlags)

                    if ((userPermissionFlagsLong.and(permissionFlagLong).toNumber()) === permissionFlagLong.toNumber()) { // bitwise AND operator for Long type values from Long.js library
                        return next();
                    } else {
                        return res.status(403).send({
                            message: `User not allowed to perform this operation`
                        });
                    }
                }

                if ((userPermissionFlags & requiredPermissionFlag) === requiredPermissionFlag) {
                    next();
                } else {
                    return res.status(403).send({
                        message: `User not allowed to perform this operation`
                    });
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
        let permissionFlagLong;
        let userPermissionFlagsLong;

        if (
            req.params &&
            req.params.userId &&
            req.params.userId === res.locals.jwt.userId
        ) {
            return next();
        } else {
            let checkResult = checkIfIs32bitInteger(PermissionFlag.ADMIN_PERMISSION)

            if (!checkResult) {
                permissionFlagLong = Long.fromBits(2, PermissionFlag.ADMIN_PERMISSION)
                userPermissionFlagsLong = Long.fromBits(2, userPermissionFlags)

                if ((userPermissionFlagsLong.add(permissionFlagLong).toNumber)) { // bitwise AND operator for Long type values from Long.js library
                    return next();
                } else {
                    return res.status(403).send();
                }
            }

            // if check is true perform below code block
            if ((userPermissionFlags & PermissionFlag.ADMIN_PERMISSION)) {

                // if ([Role.ADMIN].includes(userRole)) {
                return next();
            } else {
                return res.status(403).send();
                // return  res.send({me: userPermissionFlags, two: PermissionFlag.ADMIN_PERMISSION, three: res.locals.jwt.userId})
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
