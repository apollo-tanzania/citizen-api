import { body } from 'express-validator';
import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import permissionController from '../controller/permission';
import miscellaneousMiddleware from '../middleware/miscellaneous';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';


export class PermissionRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'PermissionRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/permissions`)
            .get(
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(
                //     PermissionFlag.ADMIN_PERMISSION
                // ),
                permissionController.listPermissions
            )
            .post(
                body('name').isString(),
                body('brand').isString(),
                body('flag').isInt(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                permissionController.createPermission
            );

        this.app.param(`permissionId`, miscellaneousMiddleware.extractPermissionId);
        this.app
            .route(`/permissions/:permissionId`)
            .all(
            // UsersMiddleware.validateUserExists,
            // jwtMiddleware.validJWTNeeded,
            // permissionMiddleware.onlySameUserOrAdminCanDoThisAction
        )
            .get(permissionController.getPermissionById)
            .delete(
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
                permissionController.removePermission
            );

        this.app.put(`/permissions/:permissionId`, [
            body('name').isString(),
            body('brand').isString(),
            body('flag').isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validateSameEmailBelongToSameUser,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            permissionController.put
        ]);

        this.app.patch(`/permissions/:permissionId`, [
            body('name').isString().optional(),
            body('brand').isString().optional(),
            body('flag').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validatePatchEmail,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            permissionController.patch,
        ]);

        return this.app;
    }
}
