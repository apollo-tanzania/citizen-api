import express from 'express';
import permissionLogService from '../service/permissionLog';
import debug from 'debug';

const log: debug.IDebugger = debug('app:permission-log-controller');

class PermissionLogController {
   
    async listPermissionLogs(req: express.Request, res: express.Response) {
        const permissionLogs = await permissionLogService.list(100, 0);
        res.status(200).send(permissionLogs);
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
