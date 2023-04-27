import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from '../controller/user';
import UsersMiddleware from '../middleware/user';
import PermissionLogController from '../controller/permissionLog'
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag, Role } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';
import express from 'express';
import MiscellaneousMiddleware from '../middleware/miscellaneous';

export class AdminsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/admins`)
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
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

        // ADMIN PERMISSION LOGS ROUTES
        this.app
            .route(`/admins/permission-logs`)
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                PermissionLogController.listPermissionLogs
            )

        this.app.param(`permissionLogId`, MiscellaneousMiddleware.extractPermissionLogId);
        this.app
            .route(`/admins/permission-logs/:permissionLogId`)
            .all(
                MiscellaneousMiddleware.validatePermissionLogExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(PermissionLogController.getPermissionLogById)
            .delete(PermissionLogController.removePermissionLog);

        // END ADMIN PERMISION LOG ROUTES
        this.app.param(`adminId`, UsersMiddleware.extractAdminId);
        this.app
            .route(`/admins/:adminId`)
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(UsersController.getAdminById)
            .get(UsersController.getAdminByEmail)
            .all(UsersMiddleware.validateAdminExists)
            .delete(UsersController.removeAdmin);

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
                PermissionFlag.ADMIN_PERMISSION
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
                PermissionFlag.ADMIN_PERMISSION
            ),
            UsersController.patch,
        ]);

        /**
         * This route does not currently require extra permissions.
         *
         * Please update it for admin usage in your own application!
         */
        this.app.put(`/admins/:adminId/permissionFlags/:permissionFlags`, [
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            jwtMiddleware.validJWTNeeded,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            jwtMiddleware.extractCurrentUserId,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlag.ADMIN_PERMISSION
            ),
            UsersController.updateAdminPermissionFlags,
        ]);

        return this.app;
    }
}
