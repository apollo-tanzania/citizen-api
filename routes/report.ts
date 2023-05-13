import { CommonRoutesConfig } from '../common/common.routes.config';
import ReportsController from '../controller/report';
import ReportVerificationLogController from '../controller/reportVerificationLog';
import UsersMiddleware from '../middleware/user';
import MiscellaneousMiddleware from '../middleware/miscellaneous';
import ReportsMiddleware from '../middleware/report';
import jwtMiddleware from '../middleware/authentication/jwt';
import permissionMiddleware from '../common/middleware/common.permission.middleware';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body, check } from 'express-validator';

import express from 'express';
import { isValueRepeated, validateFields, validateIMEINumber } from '../common/helpers/utils';
import report from '../middleware/report';
import { ifValidator } from '../common/middleware/validators/ifValidator';

export class ReportsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ReportsRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/reports`)
            .get(
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(PermissionFlag.VIEW_REPORTS),
                ReportsController.listReports
            )
            .post(
                body('phone.imei1').isNumeric().custom(validateIMEINumber),
                body('phone.imei2').isNumeric().custom(validateIMEINumber).optional(),
                body('phone.imei3').isNumeric().custom(validateIMEINumber).optional(),
                // body('phone.imei2').isNumeric().custom(validateIMEINumber).optional().if((value: string, {req}: {req: any})=> req.body.phone.imei3).notEmpty(),
                // body('phone.imei3').isNumeric().custom(validateIMEINumber).optional().if((value: string, {req}: {req: any})=> req.body.phone.imei2).notEmpty(),
                body('phone.storage').isInt().isLength({ min: 2, max: 4 }),
                body('victim.firstname').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters"),
                body('victim.middlename').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters"),
                body('victim.lastname').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters"),
                body('incident.date').isString(),
                body('incident.place').isString(),
                body('incident.depossession').isString(),
                body('incident.brief').isString(),
                body('rb').isString().optional(),
                BodyValidationMiddleware.notEmptyIfOtherFieldIsNotEmpty("phone.imei2", "phone.imei3"),
                BodyValidationMiddleware.areAllImeiValuesUnique("phone.imei1", "phone.imei2", "phone.imei3"),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.permissionFlagRequired(PermissionFlag.CREATE_REPORT),
                ReportsController.createReport
            );

        this.app
            .route(`/reports/verification-logs`)
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
                ReportVerificationLogController.listReportVerificationLogs
            )

        this.app.param(`reportId`, MiscellaneousMiddleware.extractReportId);
        this.app
            .route(`/reports/:reportId`)
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(
                permissionMiddleware.permissionFlagRequired(PermissionFlag.VIEW_REPORTS),
                ReportsController.getReportById
            )
            .delete(ReportsController.removeReport);

        this.app.put(`/reports/:reportId`, [
            body('phone.imei1').isNumeric(),
            body('phone.imei2').isNumeric(),
            body('phone.imei3').isNumeric(),
            body('victim.firstname').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters"),
            body('victim.middlename').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters"),
            body('victim.lastname').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters"),
            body('incident.date').isString(),
            body('incident.place').isString(),
            body('incident.depossession').isString(),
            body('incident.brief').isString(),
            body('rb').isString(),
            body('verified').isBoolean(),
            body('flag').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.extractCurrentUser,
            ReportsMiddleware.validateReportExists,
            UsersMiddleware.userCantChangeReportStatus,
            permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION), // it should be be edit report permissions
            ReportsController.put,
        ]);

        this.app.patch(`/reports/:reportId`, [
            body('phone.imei1').isNumeric().optional(),
            body('phone.imei2').isNumeric().optional(),
            body('phone.imei3').isNumeric().optional(),
            body('victim.firstname').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters").optional(),
            body('victim.middlename').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters").optional(),
            body('victim.lastname').isString().isLength({ min: 2 }).withMessage("Must include 2 or more characters").optional(),
            body('incident.date').isString().optional(),
            body('incident.place').isString().optional(),
            body('incident.depossession').isString().optional(),
            body('incident.brief').isString().optional(),
            body('rb').isString().optional(),
            body('verified').isBoolean().optional(),
            body('flag').isString().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.extractCurrentUser,
            ReportsMiddleware.validateReportExists,
            UsersMiddleware.userCantChangeReportStatus,
            permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
            ReportsController.patch,
        ]);

        this.app
            .route(`/reports/:reportId/approve`)
            .post(
                MiscellaneousMiddleware.removeRequestBody,
                ReportsMiddleware.extractReportId,
                jwtMiddleware.validJWTNeeded,
                jwtMiddleware.extractCurrentUserId,
                ReportsMiddleware.extractReportApprovalRequestBody(),
                permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
                ReportsController.approveReport
            )

        this.app
            .route(`/reports/:reportId/disapprove`)
            .post(
                body('reason').isString().optional(),
                MiscellaneousMiddleware.filterRequestBody(["reason"]),
                ReportsMiddleware.extractReportId,
                jwtMiddleware.validJWTNeeded,
                jwtMiddleware.extractCurrentUserId,
                ReportsMiddleware.extractReportDispprovalRequestBody(),
                permissionMiddleware.permissionFlagRequired(PermissionFlag.DISAPPROVE_REPORTS),
                ReportsController.disapproveReport
            )

        // Verification logs routes
        this.app.param(`reportVerificationLogId`, MiscellaneousMiddleware.extractReportVerificationLogId);
        this.app
            .route(`/reports/verification-logs/:reportVerificationLogId`)
            .all(
                MiscellaneousMiddleware.validateReportVerificationLogExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            )
            .get(ReportVerificationLogController.getReportVerificationLogById)
            .delete(ReportVerificationLogController.removeReportVerificationLog);

        this.app.put(`/reports/verification-logs/:reportVerificationLogId`, [
            body('reason').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.extractCurrentUser,
            MiscellaneousMiddleware.validatePermissionLogExists,
            permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION), // it should be be edit report permissions
            ReportVerificationLogController.put,
        ]);

        this.app.patch(`/reports/verification-logs/:reportVerificationLogId`, [
            body('reason').isString().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.extractCurrentUser,
            MiscellaneousMiddleware.validateReportExists,
            permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
            ReportVerificationLogController.patch,
        ]);
        // End report verification log routes


        return this.app;
    }
}
