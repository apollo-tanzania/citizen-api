import express from 'express';
import { validationResult } from 'express-validator';
import buildApiResponse from '../api/buildApiResponse';
import { getObjectValue, isArrayContainsUniqueValues } from '../helpers/utils';

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
    areAllImeiValuesUnique(field1: string, field2: string, field3: string) {
        return function (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) {


            const field1Value = getObjectValue(req.body, field1);
            const field2Value = getObjectValue(req.body, field2);
            const field3Value = getObjectValue(req.body, field3);

            if (field1Value && field2Value) {
                let imeis = [];
                imeis.push(field1Value, field2Value);
                if (!isArrayContainsUniqueValues(imeis)) {
                    const errors = []

                    errors.push({
                        value: "",
                        msg: `${field2} must not be equal to ${field1} `,
                        param: field2,
                        location: "body"
                    })

                    const validationErros = errors.map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
                    res.locals.error = { errors: validationErros }
                    return buildApiResponse(res, 400, false);
                }

            }

            if (field1Value && field2Value && field3Value) {
                let imeis = [];
                imeis.push(field1Value, field2Value, field3Value);
                if (!isArrayContainsUniqueValues(imeis)) {
                    const errors = []

                    errors.push({
                        value: "",
                        msg: `${field3} must not be equal to ${field1} or ${field2} `,
                        param: field3,
                        location: "body"
                    })

                    const validationErros = errors.map(error => ({ value: error.value, field: error.param, message: error.msg, location: error.location }))
                    res.locals.error = { errors: validationErros }
                    return buildApiResponse(res, 400, false);
                }
            }
            next()
        }
    }

}

export default new BodyValidationMiddleware();
