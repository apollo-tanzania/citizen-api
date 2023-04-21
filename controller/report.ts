import express, { response } from 'express';
import reportService from '../service/report';
import argon2 from 'argon2';
import debug from 'debug';
import { PatchUserDto } from '../dto/patchUser';
import apiResponse from '../common/api/apiResponse';
import { Errback, CookieOptions } from 'express-serve-static-core';
import { OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';
import { Socket } from 'net';

const log: debug.IDebugger = debug('app:users-controller');

class ReportsController {

    async listReports(req: express.Request, res: express.Response) {
        const reports = await reportService.list(100, 0);
        res.status(200).send(reports);
    }

    // async getUserById(req: express.Request, res: express.Response) {
    //     const user = await usersService.readById(req.body.id);
    //     res.status(200).send(user);
    // }

    /**
   * POST /api/v1/reports
   * @summary This is the summary of the endpoint
   * @tags reports
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - Bad request response
  */
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
