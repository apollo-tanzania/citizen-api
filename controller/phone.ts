import express from 'express';
import phoneService from '../service/phone';
import debug from 'debug';
import extractParamsFromQuery from '../common/helpers/utils';

const log: debug.IDebugger = debug('app:phones-controller');

class PhoneController {
   
    async listPhones(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)
        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const phones = await phoneService.list(queryParams);
            res.status(200).send(phones);
        } catch (error) {
            next(error)
        }
    
    }

    async getPhoneById(req: express.Request, res: express.Response) {
        const phone = await phoneService.readById(req.body.id);
        res.status(200).send(phone);
    }

    async createPhone(req: express.Request, res: express.Response) {
        const phoneResponse = await phoneService.create(req.body);
        if(!phoneResponse.ok){
            return res.status(201).send({ phoneResponse });

        }
        return res.status(400).send({ phoneResponse });
    }

    async patch(req: express.Request, res: express.Response) {
        await phoneService.patchById(req.body.id, req.body)
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        await phoneService.putById(req.body.id, req.body);
        res.status(204).send();
    }

    async removePhone(req: express.Request, res: express.Response) {
        await phoneService.deleteById(req.body.id)
        res.status(204).send();
    }

}

export default new PhoneController();
