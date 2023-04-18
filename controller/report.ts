import express from 'express';
import reportsService from '../service/report';
import argon2 from 'argon2';
import debug from 'debug';
import { PatchUserDto } from '../dto/patchUser';

const log: debug.IDebugger = debug('app:users-controller');

class ReportsController {
   
    async listReports(req: express.Request, res: express.Response) {
        const reports = await reportsService.list(100, 0);
        res.status(200).send(reports);
    }

    // async getUserById(req: express.Request, res: express.Response) {
    //     const user = await usersService.readById(req.body.id);
    //     res.status(200).send(user);
    // }

      /**
     * GET /api/v1/users
     * @summary This is the summary of the endpoint
     * @tags users
     * @return {object} 200 - success response - application/json
     * @return {object} 400 - Bad request response
    */
    async createReport(req: express.Request, res: express.Response) {
        const reportResponse = await reportsService.create(req.body);
        if(!reportResponse.ok){
            return res.status(201).send({ reportResponse });

        }
        return res.status(201).send({ reportResponse });
    }

    // async patch(req: express.Request, res: express.Response) {
    //     if (req.body.password) {
    //         req.body.password = await argon2.hash(req.body.password);
    //     }
    //     log(await usersService.patchById(req.body.id, req.body));
    //     res.status(204).send();
    // }

    // async put(req: express.Request, res: express.Response) {
    //     req.body.password = await argon2.hash(req.body.password);
    //     log(await usersService.putById(req.body.id, req.body));
    //     res.status(204).send();
    // }

    async removeReport(req: express.Request, res: express.Response) {
        log(await reportsService.deleteById(req.body.id));
        res.status(204).send();
    }

}

export default new ReportsController();
