import express from 'express';
import { validationResult } from 'express-validator';
import buildApiResponse from '../api/buildApiResponse';
import { getObjectValue, isArrayContainsUniqueValues, validateIMEINumber } from '../helpers/utils';

class BodyValidationMiddleware {

    verifyBodyFieldsErrors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const validationErros = errors.array().map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
            res.locals.error = { errors: validationErros }
            return buildApiResponse(res, 400, false);
        }
        next();
    }

    /**
     * 
     * @param field1 field before before field2, optional field but can not be empty if field2 is not empty
     * @param field2 field after field1, optional field
     * @returns 
     */
    notEmptyIfOtherFieldIsNotEmpty(field1: string, field2: string) {
        return function (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) {


            const field1Value = getObjectValue(req.body, field1);
            const field2Value = getObjectValue(req.body, field2);

            // Check if field2 is not empty
            if (field2Value) {

                // Check if field1 is empty or undefined
                if (!field1Value) {
                    try {

                        const errors = []

                        errors.push({
                            value: "",
                            msg: `${field1} must not be empty if ${field2} is not empty`,
                            param: field1,
                            location: "body"
                        })

                        const validationErros = errors.map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
                        res.locals.error = { errors: validationErros }
                        return buildApiResponse(res, 400, false);
                    } catch (error) {
                        next(error);
                    }
                }
            }
            next()
        }
    }

    /**
     * 
     * @param field1 
     * @param field2 
     * @param field3 
     * @returns 
     */
    areAllImeiValuesUnique(fieldName: string) {
        return function (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) {

            try {
                let imeis: string[] = [];
                let fieldValue = getObjectValue(req.body, fieldName);
                if (typeof fieldValue === 'string') {
                    let isValid = validateIMEINumber(String(fieldValue))
                    if (!isValid) {
                        const errors = []

                        errors.push({
                            value: `${fieldValue}`,
                            msg: `Invalid IMEI`,
                            param: fieldName,
                            location: "body"
                        })

                        const validationErros = errors.map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
                        res.locals.error = { errors: validationErros }
                        return buildApiResponse(res, 400, false);
                    }
                    imeis.push(fieldValue)
                    req.body.phone.imei = imeis;
                    // console.log("SINGLE VALUE ", imeis)
                } else if (isArrayContainsUniqueValues(fieldValue)) {
                    imeis = fieldValue
                    req.body.phone.imei = imeis
                    // console.log("ARRAY OF STRINGS ", imeis)
                } else {
                    const errors = []

                    errors.push({
                        value: ``,
                        msg: `Invalid IMEI`,
                        param: req.body.phone.imei,
                        location: "body"
                    })

                    const validationErros = errors.map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
                    res.locals.error = { errors: validationErros }
                    return buildApiResponse(res, 400, false);
                }

                // Validate the values
                for (let imei of imeis) {
                    try {
                        if (!validateIMEINumber(imei)) {
                            const errors = []

                            errors.push({
                                value: ``,
                                msg: `Invalid IMEI`,
                                param: req.body.phone.imei,
                                location: "body"
                            })

                            const validationErros = errors.map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
                            res.locals.error = { errors: validationErros }
                            return buildApiResponse(res, 400, false);
                        }

                    } catch (error) {
                        throw next(error)
                    }
                }

                if (!isArrayContainsUniqueValues(imeis)) {
                    const errors = []

                    errors.push({
                        value: "",
                        msg: `IMEIs must be unique`,
                        param: req.body.phone.imei,
                        location: "body"
                    })

                    const validationErros = errors.map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
                    res.locals.error = { errors: validationErros }
                    return buildApiResponse(res, 400, false);
                }
                next()

            } catch (error) {
                next(error)
            }

        }
    }

}

export default new BodyValidationMiddleware();
