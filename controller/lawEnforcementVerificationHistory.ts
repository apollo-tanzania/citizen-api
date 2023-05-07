import express from 'express';
import lawEnforcementVerificationHistoryService from '../service/lawEnforcementVerificationHistory';
import debug from 'debug';
import apiResponse from '../common/api/buildApiResponse';
import { CreateLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/createLawEnforcementVerificationHistory';
import extractParamsFromQuery from '../common/helpers/utils';

const log: debug.IDebugger = debug('app:users-controller');

class LawEnforcementVerificationHistoryController {

    /**
     * GET /api/v1/officer-verifications
     * @summary This is the summary of the endpoint
     * @tags law enforcement verification history
     * @typeof {object} VerificationHistory
     * @property {string} officerId - The officer
     * @property {string} verifiedBy - The authorizer
     * @return {array<>} 200 - success response - application/json
     * @return {object} 400 - Bad request response
     *  
     */

    async listLawEnforcementVerificationHistory(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)

        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const histories = await lawEnforcementVerificationHistoryService.list(queryParams);
            res.status(200).send(histories); 
        } catch (error) {
            next(error)
        }
      
    }

    async getLawEnforcementVerificationHistoryById(req: express.Request, res: express.Response) {
        const history = await lawEnforcementVerificationHistoryService.readById(req.body.id);
        res.status(200).send(history);
    }

    /**
   * POST /api/v1/officer-verifications
   * @summary This is the summary of the endpoint
   * @tags law enforcement verification history
   * @param {string} officerId
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - Bad request response
  */
    async createReportLawEnforcementVerificationHistory(req: express.Request, res: express.Response) {
        const response = await lawEnforcementVerificationHistoryService.create(req.body);

        if (response?.errors) {
            res.locals.data = {
                message: "Create history Failed.",
                data: response
            }

            return apiResponse(res, 400);
        }

        if (response?.type === "Conflict") {
            res.locals.data = {
                message: "Law enforcement officer already verified.",
            }

            return apiResponse(res, 409);
        }

     
        res.locals.data = {
            message: "Verification history created",
            data: response
        }
        apiResponse(res, 201)
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
