import { CommonRoutesConfig } from '../common/common.routes.config';
import imeiController from '../controller/imei';
import PhoneMiddleware from '../middleware/phone';
import imeiMiddleware from '../middleware/imei';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

import express from 'express';
import { validateIMEINumber } from '../common/helpers/utils';

export class ImeiRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ImeiRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/imeis`)
            .get(
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(
                //     PermissionFlag.ADMIN_PERMISSION
                // ),
                imeiController.listImeis
            )
            .post(
                body('tac').isInt().isEmpty(),
                body('serialNumber').isInt().isEmpty(),
                body('checkDigit').isInt().isEmpty(),
                body('deviceSpecification.operatingSystem').isEmpty(),
                body('name').isString().isEmpty(),
                body('brand').isString().isEmpty(),
                body('model').isString().isEmpty(),
                body('models').isArray().isEmpty(),
                body('manufacturer').isString().isEmpty(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                imeiController.createImei
            );

        this.app
            .route(`/imeis/search`)

        this.app.param(`imeiId`, PhoneMiddleware.extractImeiId);
        this.app
            .route(`/imeis/:imeiId`)
            .all(
                imeiMiddleware.validateImeiExists,
                // jwtMiddleware.validJWTNeeded,
            )
            .get(imeiController.getImeiById)
            .delete(
                // permissionMiddleware.onlySameUserOrAdminCanDoThisAction
                imeiController.removeImei
            );

        this.app.put(`/imeis/:imeiId`, [
            body('imei1').isInt(),
            body('imei2').isInt().optional(),
            body('imei3').isInt().optional(),
            body('name').isString(),
            body('brand').isString(),
            body('manufacturer').isString(),
            body('model').isString(),
            body('capacity').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            imeiController.put,
        ]);

        this.app.patch(`/imeis/:imeiId`, [
            body('imei1').isInt().optional().custom(validateIMEINumber),
            body('imei2').isInt().optional(),
            body('imei3').isInt().optional(),
            body('name').isString().optional(),
            body('brand').isString().optional(),
            body('manufacturer').isString().optional(),
            body('model').isString().optional(),
            body('capacity').isString().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // permissionMiddleware.permissionFlagRequired(
            //     PermissionFlag.PAID_PERMISSION
            // ),
            imeiController.patch,
        ]);

        this.app.param('IMEI', PhoneMiddleware.extractAndValidatePhoneIMEI)
        this.app
            .route(`/imeis/search/:IMEI`)
            .get(imeiController.search)

        return this.app;
    }
}
