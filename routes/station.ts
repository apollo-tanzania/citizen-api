import { CommonRoutesConfig } from '../common/common.routes.config';
import StationsController from '../controller/station';
import StationsMiddleware from '../middleware/station';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

import express from 'express';

export class StationsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'StationsRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/stations`)
            .get(
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(
                //     PermissionFlag.ADMIN_PERMISSION
                // ),
                StationsController.listStations
            )
            .post(
                // body('email').isEmpty(),
                // body('password')
                //     .isLength({ min: 5 })
                //     .withMessage('Must include password (5+ characters)'),
                // BodyValidationMiddleware.verifyBodyFieldsErrors,
                // UsersMiddleware.validateSameEmailDoesntExist,
                StationsController.createStation
            );

        this.app.param(`stationId`, StationsMiddleware.extractStationId);
        this.app
            .route(`/stations/:stationId`)
            // .all(
            //     UsersMiddleware.validateUserExists,
            //     jwtMiddleware.validJWTNeeded,
            //     permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            // )
            .get(StationsController.getStationById)
            .delete(StationsController.removeStation);

        this.app.put(`/stations/:stationId`, [
            body('name').isString(),
            body('location').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validateSameEmailBelongToSameUser,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            StationsController.put,
        ]);

        this.app.patch(`/stations/:stationId`, [
            body('name').isString().optional(),
            body('location').isString().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validatePatchEmail,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            StationsController.patch,
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
