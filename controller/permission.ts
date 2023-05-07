import express from 'express';
import permissionService from '../service/permission';
import debug from 'debug';
import extractParamsFromQuery, { validateIMEINumber } from '../common/helpers/utils';
import buildApiResponse from '../common/api/buildApiResponse';

const log: debug.IDebugger = debug('app:imeis-controller');

class PermissionController {

    async listPermissions(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)
        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const permissions = await permissionService.list(queryParams);
            res.status(200).send(permissions);
        } catch (error) {
            next(error)
        }
    }

    async getPermissionById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const permission = await permissionService.readById(req.body.id);
            // res.status(200).send(permission);
            // assign value to to be sent to client to data object variable
            res.locals.data = permission
            buildApiResponse(res, 200, true, "Success")
        } catch (error) {
            next(error)
        }
    }

    async createPermission(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const result = await permissionService.create(req.body);
            res.status(201).send({ result });
        } catch (error) {
            next(error);
        }
    }

    async patch(req: express.Request, res: express.Response) {
        log(await permissionService.patchById(req.body.id, req.body))
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await permissionService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removePermission(req: express.Request, res: express.Response) {
        log(await permissionService.deleteById(req.body.id))
        res.status(204).send();
    }

}

export default new PermissionController();
