import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from '../controller/user';
import UsersMiddleware from '../middleware/user';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

import express from 'express';

export class AdminsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/admins`)
            .get(
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(
                //     PermissionFlag.ADMIN_PERMISSION
                // ),
                UsersController.listAdmins
            )
            .post(
                body('email').isEmail(),
                body('password')
                    .isLength({ min: 5 })
                    .withMessage('Must include password (5+ characters)'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createAdmin
            );

        this.app.param(`adminId`, UsersMiddleware.extracAdminId);
        this.app
            .route(`/admins/:adminId`)
            .all(
                UsersMiddleware.validateAdminExists,
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(UsersController.getAdminById)
            .delete(UsersController.removeUser);

        this.app.put(`/admins/:adminId`, [
            body('email').isEmail(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)'),
            body('firstName').isString(),
            body('lastName').isString(),
            body('permissionFlags').isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersMiddleware.userCantChangePermission,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlag.PAID_PERMISSION
            ),
            UsersController.put,
        ]);

        this.app.patch(`/admins/:adminId`, [
            body('email').isEmail().optional(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Password must be 5+ characters')
                .optional(),
            body('firstName').isString().optional(),
            body('lastName').isString().optional(),
            body('permissionFlags').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validatePatchEmail,
            UsersMiddleware.userCantChangePermission,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlag.PAID_PERMISSION
            ),
            UsersController.patch,
        ]);

        /**
         * This route does not currently require extra permissions.
         *
         * Please update it for admin usage in your own application!
         */
        this.app.put(`/admins/:admiinId/permissionFlags/:permissionFlags`, [
            jwtMiddleware.validJWTNeeded,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlag.FREE_PERMISSION
            ),
            UsersController.updatePermissionFlags,
        ]);

        return this.app;
    }
}
