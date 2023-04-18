import express from 'express';
import stationService from '../service/station';

class StationsMiddleware {
    // async validateSameEmailDoesntExist(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     const user = await stationService.getUserByEmail(req.body.email);
    //     if (user) {
    //         res.status(400).send({ errors: ['User email already exists'] });
    //     } else {
    //         next();
    //     }
    // }

    // async validateSameEmailBelongToSameUser(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     if (res.locals.user._id === req.params.userId) {
    //         next();
    //     } else {
    //         res.status(400).send({ errors: ['Invalid email'] });
    //     }
    // }

    // async userCantChangePermission(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     if (
    //         'permissionFlags' in req.body &&
    //         req.body.permissionFlags !== res.locals.user.permissionFlags
    //     ) {
    //         res.status(400).send({
    //             errors: ['User cannot change permission flags'],
    //         });
    //     } else {
    //         next();
    //     }
    // }

    // validatePatchEmail = async (
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) => {
    //     if (req.body.email) {
    //         this.validateSameEmailBelongToSameUser(req, res, next);
    //     } else {
    //         next();
    //     }
    // };

    async validateStationExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const station = await stationService.readById(req.params.stationId);
        if (station) {
            res.locals.station = station;
            next();
        } else {
            res.status(404).send({
                errors: [`Station ${req.params.stationId} not found`],
            });
        }
    }

    async extractStationId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.stationId;
        next();
    }
}

export default new StationsMiddleware();
