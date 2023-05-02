import express from 'express';
import reportVerificationLogService from '../service/reportVerificationLog';
import debug from 'debug';
import extractParamsFromQuery from '../common/helpers/utils';

const log: debug.IDebugger = debug('app:report-verification-log-controller');

class ReportVerificationLogController {

    async listReportVerificationLogs(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)

        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const reportVerificationLogs = await reportVerificationLogService.list(queryParams);
            res.status(200).send(reportVerificationLogs);
        } catch (error) {
            next(error)
        }
    }

    async getReportVerificationLogById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const reportVerificationLog = await reportVerificationLogService.readById(req.body.id);
            res.status(200).send(reportVerificationLog);
        } catch (error) {
            next(error);
        }
    }

    async createReportVerificationLog(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const reportVerificationLog = await reportVerificationLogService.create(req.body);
            res.status(201).send({ id: reportVerificationLog });
        } catch (error) {
            next(error);
        }
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(await reportVerificationLogService.patchById(req.body.id, req.body));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async put(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(await reportVerificationLogService.putById(req.body.id, req.body));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async removeReportVerificationLog(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(await reportVerificationLogService.deleteById(req.body.id))
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

}

export default new ReportVerificationLogController();
