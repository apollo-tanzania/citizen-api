import express from 'express';
import phoneService from '../service/phone';
import permissionLog from '../service/permissionLog';
import debug from 'debug';

const log: debug.IDebugger = debug('app:permission-log-controller');

class PermissionLogController {
   
    async listPermissionLogs(req: express.Request, res: express.Response) {
        const logs = await permissionLog.list(100, 0);
        res.status(200).send(logs);
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

export default new PermissionLogController();
