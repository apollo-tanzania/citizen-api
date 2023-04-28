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
            ('permissionFlags' in req.body &&
                req.body.permissionFlags !== res.locals.user.permissionFlags) ||
            ('role' in req.body &&
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
            ('permissionFlags' in req.body &&
                req.body.permissionFlags !== res.locals.user.permissionFlags) ||
            ('role' in req.body &&
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

    /**
   * This middleware is responsible for checking if the user with admin role exists
   * @param req 
   * @param res 
   * @param next 
   */
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

    /**
   * This middleware is responsible for handling the extraction of param representing user
   * @param req 
   * @param res 
   * @param next 
   */
    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }

    /**
       * This middleware is responsible for handling the extraction of param representing user with law admin role
       * @param req 
       * @param res 
       * @param next 
       */
    async extractAdminId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.adminId;
        next();
    }

    /**
   * This middleware is responsible for handling the extraction of param representing user with law enforcement role
   * @param req 
   * @param res 
   * @param next 
   */
    async extractLawEnforcementId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.lawEnforcementId;
        next();
    }

    /**
     * This middleware is responsible for handling the extraction of param representing user with law enforcement role
     * @param req 
     * @param res 
     * @param next 
     */
    async extractOffcerId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.lawEnforcementId = req.params.lawEnforcementId;
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

    async extractPermissionLogId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.permissionLogId;
        next();
    }

    /**
     * This middleware is responsible for handling reports tempering by unauthorized user
     * @param req 
     * @param res 
     * @param next 
     */
    async userCantChangeReportStatus(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            ('verified' in req.body &&
                req.body.verified !== res.locals.report.verified)
        ) {
            res.status(400).send({
                message: 'User cannot change report status',
            });
        } else {
            next();
        }
    }

}

export default new UsersMiddleware();
