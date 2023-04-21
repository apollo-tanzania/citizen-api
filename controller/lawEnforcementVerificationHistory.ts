import express from 'express';
import lawEnforcementVerificationHistoryService from '../service/lawEnforcementVerificationHistory';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class LawEnforcementVerificationHistoryController {

    async listLawEnforcementVerificationHistory(req: express.Request, res: express.Response) {
        const histories = await lawEnforcementVerificationHistoryService.list(100, 0);
        res.status(200).send(histories);
    }

    async getLawEnforcementVerificationHistoryById(req: express.Request, res: express.Response) {
        const history = await lawEnforcementVerificationHistoryService.readById(req.body.id);
        res.status(200).send(history);
    }

    /**
   * POST /api/v1/reports
   * @summary This is the summary of the endpoint
   * @tags reports
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - Bad request response
  */
    async createReportLawEnforcementVerificationHistory(req: express.Request, res: express.Response) {
        const response = await lawEnforcementVerificationHistoryService.create(req.body);
  
        if(response?.type === "Conflict"){
            return res.status(409).send(response)
        }

        return res.status(201).send(response);
    }

    async patch(req: express.Request, res: express.Response) {
        log(await lawEnforcementVerificationHistoryService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await lawEnforcementVerificationHistoryService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeLawEnforcementVerificationHistory(req: express.Request, res: express.Response) {
        log(await lawEnforcementVerificationHistoryService.deleteById(req.body.id));
        res.status(204).send();
    }

}

export default new LawEnforcementVerificationHistoryController();
