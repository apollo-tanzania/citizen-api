import express from 'express';
import phoneService from '../service/phone';

class PhoneMiddleware {

    async validateStationExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const phone = await phoneService.readById(req.params.phoneId);
        if (phone) {
            res.locals.phone = phone;
            next();
        } else {
            res.status(404).send({
                errors: [`Phone ${req.params.phoneId} not found`],
            });
        }
    }

    async extractPhoneId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.phoneId;
        next();
    }
}

export default new PhoneMiddleware();
