import express, { response } from 'express';
import reportService from '../service/report';
import debug from 'debug';
import apiResponse from '../common/api/apiResponse';
import extractParamsFromQuery from '../common/helpers/utils';


const log: debug.IDebugger = debug('app:users-controller');

class ReportsController {

    async listReports(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)

        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const reports = await reportService.list(queryParams);
            res.status(200).send(reports); 
        } catch (error) {
            next(error)
        }
      
    }

    async getReportById(req: express.Request, res: express.Response) {
        const user = await reportService.readById(req.body.id);
        res.status(200).send(user);
    }

    async createReport(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const reportResponse = await reportService.create({ ...req.body });
            // res.locals.report = reportResponse;
            if (reportResponse?.errors) {
                // return res.status(400).send(reportResponse);
                res.locals.data = {
                    message: "Could not add report to the database",
                    errorDescription: reportResponse
                }
                return apiResponse(res, 400)
            }
            res.locals.data = reportResponse
            apiResponse(res, 201);
        } catch (error) {
            next(error);
        }
    }

    async patch(req: express.Request, res: express.Response) {
        log(await reportService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await reportService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeReport(req: express.Request, res: express.Response) {
        log(await reportService.deleteById(req.body.id));
        res.status(204).send();
    }

}

export default new ReportsController();
