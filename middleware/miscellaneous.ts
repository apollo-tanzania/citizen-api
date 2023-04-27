import express from 'express';
import permissionLogService from '../service/permissionLog';
class MiscellaneousMiddleware {

    async validatePermissionLogExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const permissionLog = await permissionLogService.readById(req.params.permissionLogId);
        if (permissionLog) {
            res.locals.permissionLog = permissionLog;
            next();
        } else {
            res.status(404).send({
                errors: [`Log ${req.params.permissionLogId} not found`],
            });
        }
    }

    async extractHistoryId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.historyId;
        next();
    }

    async extractPermissionLogId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.permissionLogId;
        next();
    }


}

export default new MiscellaneousMiddleware();
