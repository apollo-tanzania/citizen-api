import express from 'express';
import { isObjectEmpty } from '../common/helpers/utils';
import reportService from '../service/report';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';

class ReportsMiddleware {
    async validateReportExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if (!isValidObjectId(req.params.reportId)) throw new BadRequestError("Invalid ObjectId")

            const report = await reportService.readById(req.params.reportId);
            if (report) {
                res.locals.report = report;
                next();
            } else {
                res.status(404).send({
                    error: "Validation Error",
                    message: `Report ${req.params.reportId} not found`,
                });
            }
        } catch (error) {
            next(error);
        }

    }

    async extractReportId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if (!isValidObjectId(req.params.reportId)) throw new BadRequestError("Invalid ID", 400);
            req.body.id = req.params.reportId;
            next();
        } catch (error) {
            next(error);
        }

    }

    extractReportApprovalRequestBody() {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {

            if (isObjectEmpty(req.body)) return res.status(400).send()

            // filter array
            let selectedRequestBodyProperties = ["id", "authorizedBy"]

            // Assign req.body object to temporary object
            let requestBodyObject = req.body;

            // Check if the request body as more or less than expected properties
            if (!(Object.keys(requestBodyObject).length === selectedRequestBodyProperties.length)) return res.status(400).send({
                message: "Invalid request body"
            })

            // Filter only selected request properties
            Object.keys(requestBodyObject).forEach(property => {
                if (!selectedRequestBodyProperties.includes(property)) {
                    delete requestBodyObject[property];
                }
            })

            // Update filtered request body properties
            req.body = requestBodyObject;

            // Add verified request body property which is set to true
            req.body.verified = true;

            next();
        }
    }

    extractReportDispprovalRequestBody() {
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {

            if (isObjectEmpty(req.body)) return res.status(400).send()

            // filter array
            let selectedRequestBodyProperties = ["id", "authorizedBy", "reason"]

            // Assign req.body object to temporary object
            let requestBodyObject = req.body;

            // Check if the request body as more or less than expected properties
            if (!(Object.keys(requestBodyObject).length === selectedRequestBodyProperties.length)) return res.status(400).send({
                message: "Invalid request body"
            })

            // Filter only selected request properties
            Object.keys(requestBodyObject).forEach(property => {
                if (!selectedRequestBodyProperties.includes(property)) {
                    delete requestBodyObject[property];
                }
            })

            // Update filtered request body properties
            req.body = requestBodyObject;

            // Add verified request body property which is set to true
            req.body.verified = false;

            next();
        }
    }
}


export default new ReportsMiddleware();
