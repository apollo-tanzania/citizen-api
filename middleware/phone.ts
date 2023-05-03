import express from 'express';
import phoneService from '../service/phone';
import { validateIMEINumber } from '../common/helpers/utils';

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

    async extractAndValidatePhoneIMEI(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {

        // Covert to the param value IMEI from string to number
        // if(req.params.IMEI.startsWith(":")) return res.status(400).send()
        // const IMEI = parseInt(req.params.IMEI)
        // if(Number.isNaN(IMEI)) return res.status(400).send({
        //     error: {
        //         paramName: 'IMEI',
        //         message: "Invalid param value. It should be a number",
        //         location: 'params'
        //     }
        // })

        // if(IMEI.toString().length !== 15 ) return res.status(400).send({
        //     error: {
        //         paramName: 'IMEI',
        //         message: "Invalid value. Must have 15 digits",
        //         location: 'params'
        //     }
        // })
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
