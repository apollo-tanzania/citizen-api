import { CommonRoutesConfig } from '../common/common.routes.config';
import ReportsController from '../controller/report';
import PhoneController from '../controller/phone';
import PhoneMiddleware from '../middleware/phone';
import UsersMiddleware from '../middleware/user';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

import express from 'express';

export class PhonesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'PhonesRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/phones`)
            .get(
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(
                //     PermissionFlag.ADMIN_PERMISSION
                // ),
                PhoneController.listPhones
            )
            .post(
                // body('email').isEmpty(),
                // body('password')
                //     .isLength({ min: 5 })
                //     .withMessage('Must include password (5+ characters)'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                // UsersMiddleware.validateSameEmailDoesntExist,
                PhoneController.createPhone
            );

        this.app.param(`phoneId`, PhoneMiddleware.extractPhoneId);
        this.app
            .route(`/phones/:phoneId`)
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(PhoneController.getPhoneById)
            .delete(PhoneController.removePhone);

        this.app.put(`/phones/:phoneId`, [
            body('imei1').isInt(),
            body('imei2').isInt().optional(),
            body('imei3').isInt().optional(),
            body('name').isString(),
            body('brand').isString(),
            body('manufacturer').isString(),
            body('model').isString(),
            body('capacity').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validateSameEmailBelongToSameUser,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            PhoneController.put,
        ]);

        this.app.patch(`/phones/:phoneId`, [
            body('imei1').isInt().optional(),
            body('imei2').isInt().optional(),
            body('imei3').isInt().optional(),
            body('name').isString().optional(),
            body('brand').isString().optional(),
            body('manufacturer').isString().optional(),
            body('model').isString().optional(),
            body('capacity').isString().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validatePatchEmail,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            PhoneController.patch,
        ]);

        /**
         * This route does not currently require extra permissions.
         *
         * Please update it for admin usage in your own application!
        //  */
        // this.app.put(`/users/:userId/permissionFlags/:permissionFlags`, [
        //     jwtMiddleware.validJWTNeeded,
        //     permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        //     permissionMiddleware.permissionFlagRequired(
        //         PermissionFlag.FREE_PERMISSION
        //     ),
        //     UsersController.updatePermissionFlags,
        // ]);

        return this.app;
    }
}
