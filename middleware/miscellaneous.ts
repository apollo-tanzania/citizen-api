import express from 'express';
import { createMongooseObjectIDInstance, isObjectEmpty } from '../common/helpers/utils';
import permissionLogService from '../service/permissionLog';
import reportService from '../service/report';
import reportVerificationLogService from '../service/reportVerificationLog';


class MiscellaneousMiddleware {

    async validatePermissionLogExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const permissionLog = await permissionLogService.readById(req.params.permissionLogId);
        if (permissionLog) {
            res.locals.permissionLog = permissionLog;
            next();
        } else {
            res.status(404).send({
                error: {
                    status: "Validation Error",
                    message: `Log ${req.params.permissionLogId} not found`,
                }
            });
        }
    }

    async validateReportExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const report = await reportService.readById(req.params.reportId);
        if (report) {
            res.locals.report = report;
            next();
        } else {
            res.status(404).send({
                error: {
                    status: 'Validation Error',
                    message: `Report ${req.params.reportId} not found`,
                }
            });
        }
    }

    async validateReportVerificationLogExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            // Use it to validate ID if using mongo
            const isValidReportVerificationLogId = createMongooseObjectIDInstance(req.params.reportVerificationLogId)

            if (!isValidReportVerificationLogId) return res.status(404).send({
                errors: [
                    {
                        paramName: "reportVerificationLogId",
                        message: "Invalid value",
                        location: "params"
                    }
                ]
            })

            const reportVerificationLog = await reportVerificationLogService.readById(req.params.reportVerificationLogId);

            if (reportVerificationLog) {
                res.locals.reportVerificationLog = reportVerificationLog;
                next();
            } else {
                res.status(404).send({
                    error: {
                        message: `Report verificaion log ${req.params.reportVerificationLogId} not found`,
                    }
                });
            }
        } catch (error) {
            res.status(500).send(error);
        }
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

    async extractReportId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.reportId;
        next();
    }

    async extractReportVerificationLogId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.reportVerificationLogId;
        next();
    }

    filterRequestBody(selectedRequestBodyProperties: string[]) {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            let requestBodyObject = req.body;

            if (selectedRequestBodyProperties.length <= 0) {
                delete req.body;
                return res.status(404).send({
                    message: 'Invalid request'
                })
            }

            Object.keys(requestBodyObject).forEach(property => {
                if (!selectedRequestBodyProperties.includes(property)) {
                    delete requestBodyObject[property];
                }
            })

            req.body = requestBodyObject;

            next()
        }
    }

    /**
   * This middleware checks if request body object is empty 
   * @param req 
   * @param res 
   * @param next 
   */
    allowOnlyEmptyRequestBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!isObjectEmpty(req.body)) return res.status(400).send({
            message: "Request body must be empty",
            body: req.body
        })
        next();
    }

    /**
     * This middleware removes all properties from the request body object
     * @param req 
     * @param res 
     * @param next 
     */
    removeRequestBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body = {}
        next();
    }


}

export default new MiscellaneousMiddleware();
