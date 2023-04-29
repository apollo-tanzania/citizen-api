import express from 'express';
import permissionLogService from '../service/permissionLog';
import debug from 'debug';
import extractParamsFromQuery from '../common/helpers/utils';

const log: debug.IDebugger = debug('app:permission-log-controller');

class PermissionLogController {
   
    async listPermissionLogs(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)

        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const permissionLogs = await permissionLogService.list(queryParams);
            res.status(200).send(permissionLogs);
        } catch (error) {
            next(error)
        }   
       
    }

    async getPermissionLogById(req: express.Request, res: express.Response) {
        const permissionLog = await permissionLogService.readById(req.body.id);
        res.status(200).send(permissionLog);
    }

    async removePermissionLog(req: express.Request, res: express.Response) {
        await permissionLogService.deleteById(req.body.id)
        res.status(204).send();
    }

}

export default new PermissionLogController();
