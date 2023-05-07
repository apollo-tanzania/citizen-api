import express from 'express';
import phoneService from '../service/phone';
import { validateIMEINumber } from '../common/helpers/utils';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';

class PhoneMiddleware {

    async extractPhoneId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.phoneId;
        next();
    }

    async extractImeiId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.imeiId;
        next();
    }

    async extractAndValidatePhoneIMEI(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const isValidIMEINumber = validateIMEINumber(req.params.IMEI)

        if (!isValidIMEINumber) return res.status(400).send({
            error: {
                paramName: 'IMEI',
                message: "Invalid IMEI number",
                location: 'params'
            }
        })
        req.body.imei = parseInt(req.params.IMEI);
        next();
    }

    async validatePhoneExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {

        if (!isValidObjectId(req.params.phoneId)) throw new BadRequestError("Invalid ObjectID", 400);

        const phone = await phoneService.readById(req.params.userId);
        if (phone) {
            res.locals.phone = phone;
            next();
        } else {
            res.status(404).send({
                errors: [`User ${req.params.userId} not found`],
            });
        }
    }
}

export default new PhoneMiddleware();
