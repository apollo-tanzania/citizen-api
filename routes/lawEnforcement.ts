import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from '../controller/user';
import lawEnforcementVerificationHistoryController from '../controller/lawEnforcementVerificationHistory';
import UsersMiddleware from '../middleware/user';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag, Role } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

import express from 'express';

export class LawEnforcementRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'LawEnforcementRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/law-enforcements`)
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    [PermissionFlag.ADMIN_PERMISSION, PermissionFlag.LAW_ENFORCEMENT_ADMIN_PERMISSION],
                    [Role.LAW_ENFORCEMENT, Role.ADMIN]
                ),
                UsersController.listLawEnforcementOfficers
            )
            .post(
                body('email').isEmail(),
                body('password')
                    .isLength({ min: 5 })
                    .withMessage('Must include password (5+ characters)'),
                body('firstName').isString(),
                body('middleName').isString(),
                body('lastName').isString(),
                body('station').isString(),
                body('badgeNumber').isString(),
                body('permissionFlags').isInt().optional(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createLawEnforcementOfficer
            );

        // Route for getting all law enforcement officers
        this.app
            .route(`/law-enforcements/officer-verifications`)
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    [PermissionFlag.LAW_ENFORCEMENT_ADMIN_PERMISSION, PermissionFlag.ADMIN_PERMISSION]
                ),
                // permissionMiddleware.onlySomeUserOrAdminCanDoThisAction,
                lawEnforcementVerificationHistoryController.listLawEnforcementVerificationHistory
            )
            .post(
                body('officerId').isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                jwtMiddleware.extractCurrentUserId,
                UsersController.updateLawEnforcementVerificationStatus
            )

        this.app
            .route(`/law-enforcements/officer-verifications/revoke`)
            .post(
                body('officerId').isString(),
                body('reason').isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                jwtMiddleware.extractCurrentUserId,
                UsersController.revokeLawEnforcementVerificationStatus
            )

        this.app.param(`userId`, UsersMiddleware.extractUserId);
        this.app
            .route(`/law-enforcements/:userId`)
            .all(
                // UsersMiddleware.validateAdminExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(UsersController.getLawEnforcementOfficerById)
            .get(UsersController.getLawEnforcementOfficerByEmail)
            .delete(UsersController.removeLawEnforcementOfficer);

        this.app.put(`/law-enforcements/:userId`, [
            body('email').isEmail(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)'),
            body('firstName').isString(),
            body('middleName').isString(),
            body('lastName').isString(),
            body('station').isString(),
            body('badgeNumber').isString(),
            body('permissionFlags').isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validateSameEmailBelongToSameUser,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            UsersController.putLawEnforcementOfficer,
        ]);

        this.app.patch(`/law-enforcements/:userId`, [
            body('email').isEmail().optional(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Password must be 5+ characters')
                .optional(),
            body('firstName').isString().optional(),
            body('middleName').isString().optional(),
            body('lastName').isString().optional(),
            body('station').isString().optional(),
            body('badgeNumber').isString().optional(),
            body('permissionFlags').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validatePatchEmail,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            UsersController.patchLawEnforcementOfficer,
        ]);

        /**
         * This route does not currently require extra permissions.
         *
         * Please update it for admin usage in your own application!
         */
        this.app.put(`/law-enforcements/:userId/permissionFlags/:permissionFlags`, [
            jwtMiddleware.validJWTNeeded,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.permissionFlagRequired(
                [PermissionFlag.LAW_ENFORCEMENT_ADMIN_PERMISSION, PermissionFlag.ADMIN_PERMISSION, PermissionFlag.ADMIN_PERMISSION_NOT_ALL_PERMISSIONS]
            ),
            UsersController.updateLawEnforcementPermissionFlags,
        ]);

        // this.app
        // .route(`/law-enforcements/officer-verifications`)
        // .get(
        //     jwtMiddleware.validJWTNeeded,
        //     permissionMiddleware.permissionFlagRequired(
        //         [PermissionFlag.LAW_ENFORCEMENT_ADMIN_PERMISSION, PermissionFlag.ADMIN_PERMISSION]
        //     ),
        //     // permissionMiddleware.onlySomeUserOrAdminCanDoThisAction,
        //     lawEnforcementVerificationHistoryController.listLawEnforcementVerificationHistory
        // )

        // verify route
        // this.app.put(`/law-enforcements/:userId/verification/:status`, [
        //     jwtMiddleware.validJWTNeeded,
        //     permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        //     permissionMiddleware.permissionFlagRequired(
        //        [ PermissionFlag.LAW_ENFORCEMENT_ADMIN_PERMISSION]
        //     ),
        //     UsersController.updateLawEnforcementPermissionFlags,
        // ]);

        return this.app;
    }
}
