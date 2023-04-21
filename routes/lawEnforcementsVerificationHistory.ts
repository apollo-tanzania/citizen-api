import { CommonRoutesConfig } from '../common/common.routes.config';
import lawEnforcementVerificationHistoryController from '../controller/lawEnforcementVerificationHistory';
import UsersMiddleware from '../middleware/user';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

import express from 'express';

export class LawEnforcementVerificationHistoryRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'LawEnforcementVerificationHistoryRoutesRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/officer-verifications`)
            .get(
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(
                //     PermissionFlag.ADMIN_PERMISSION
                // ),
                lawEnforcementVerificationHistoryController.listLawEnforcementVerificationHistory
            )
            .post(
                body('officerId').isString(),
                // body('verifiedBy').isString(),
                // body('password')
                //     .isLength({ min: 5 })
                //     .withMessage('Must include password (5+ characters)'),
                // body('firstName').isString(),
                // body('middleName').isString(),
                // body('lastName').isString(),
                // body('station').isString(),
                // body('badgeNumber').isString(),
                // body('permissionFlags').isInt().optional(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                jwtMiddleware.extractCurrentUserId,
                // UsersMiddleware.validateSameEmailDoesntExist,
                lawEnforcementVerificationHistoryController.createReportLawEnforcementVerificationHistory
            );

        this.app.param(`historyId`, UsersMiddleware.extractHistoryId);
        this.app
            .route(`/officer-verifications/:historyId`)
            .all(
            // UsersMiddleware.validateAdminExists,
            // jwtMiddleware.validJWTNeeded,
            // permissionMiddleware.onlySameUserOrAdminCanDoThisAction
        )
            .get(lawEnforcementVerificationHistoryController.getLawEnforcementVerificationHistoryById)
            .delete(lawEnforcementVerificationHistoryController.removeLawEnforcementVerificationHistory);

        this.app.put(`/officer-verifications/:historyId`, [
            // body('email').isEmail(),
            // body('password')
            //     .isLength({ min: 5 })
            //     .withMessage('Must include password (5+ characters)'),
            // body('firstName').isString(),
            // body('middleName').isString(),
            // body('lastName').isString(),
            // body('station').isString(),
            // body('badgeNumber').isString(),
            // body('permissionFlags').isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validateSameEmailBelongToSameUser,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            lawEnforcementVerificationHistoryController.put,
        ]);

        this.app.patch(`/officer-verifications/:historyId`, [
            // body('email').isEmail().optional(),
            // body('password')
            //     .isLength({ min: 5 })
            //     .withMessage('Password must be 5+ characters')
            //     .optional(),
            // body('firstName').isString().optional(),
            // body('middleName').isString().optional(),
            // body('lastName').isString().optional(),
            // body('station').isString().optional(),
            // body('badgeNumber').isString().optional(),
            // body('permissionFlags').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validatePatchEmail,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            lawEnforcementVerificationHistoryController.patch,
        ]);

        /**
         * This route does not currently require extra permissions.
         *
         * Please update it for admin usage in your own application!
         */
        // this.app.put(`/admins/:admiinId/permissionFlags/:permissionFlags`, [
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
