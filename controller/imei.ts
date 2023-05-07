import express from 'express';
import imeiService from '../service/imei';
import debug from 'debug';
import extractParamsFromQuery, { validateIMEINumber } from '../common/helpers/utils';
import buildApiResponse from '../common/api/buildApiResponse';

const log: debug.IDebugger = debug('app:imeis-controller');

class ImeiController {

    async listImeis(req: express.Request, res: express.Response, next: express.NextFunction) {
        const queryParams = extractParamsFromQuery(req.query)
        if (!queryParams) return res.status(400).send({ message: "Invalid query body properties" })
        try {
            const imeis = await imeiService.list(queryParams);
            res.locals.data = imeis;
            buildApiResponse(res, 200, true)
        } catch (error) {
            next(error)
        }

    }

    async getImeiById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const imei = await imeiService.readById(req.body.id);
            res.locals.data = imei;
            buildApiResponse(res, 200, true)
        } catch (error) {
            next(error)
        }

    }

    async search(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const imei = await imeiService.search(req.body.imei);
            res.locals.data = imei
            buildApiResponse(res, 200, true)
        } catch (error) {
            next(error);
        }

    }

    async createImei(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const result = await imeiService.create(req.body);
            res.status(201).send({ result });
        } catch (error) {
            next(error);
        }
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            log(await imeiService.patchById(req.body.id, req.body))
            res.status(204).send();
        } catch (error) {
            next(error)
        }
    }

    async put(req: express.Request, res: express.Response) {
        log(await imeiService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeImei(req: express.Request, res: express.Response) {
        log(await imeiService.deleteById(req.body.id))
        res.status(204).send();
    }

}

export default new ImeiController();
