import express from 'express';
import userService from '../service/user';
import adminService from '../service/admin';


class UsersMiddleware {
    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({ errors: ['User email already exists'] });
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (res.locals.user._id === req.params.userId) {
            next();
        } else {
            res.status(400).send({ errors: ['Invalid email'] });
        }
    }

    async userCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
           ( 'permissionFlags' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags) ||
           ( 'role' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags)
        ) {
            res.status(400).send({
                errors: ['User cannot change permission flags or roles'],
            });
        } else {
            next();
        }
    }

    
    async userCantDeletePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
           ( 'permissionFlags' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags) ||
           ( 'role' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags)
        ) {
            res.status(400).send({
                errors: ['User cannot change permission flags or roles'],
            });
        } else {
            next();
        }
    }

    validatePatchEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.email) {
            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.params.userId);
        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({
                errors: [`User ${req.params.userId} not found`],
            });
        }
    }

    async validateAdminExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await adminService.readById(req.params.userId);
        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({
                errors: [`Admin ${req.params.userId} not found`],
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }

    async extractAdminId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.adminId;
        next();
    }

    async extractLawEnforcementId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.lawEnforcementId;
        next();
    }

    async extractHistoryId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.historyId;
        next();
    }


}

export default new UsersMiddleware();
