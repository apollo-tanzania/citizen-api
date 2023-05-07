import express from 'express';
import { BadGateWayError } from '../errors/BadGateWayError';
import { BadRequestError } from '../errors/BadRequestError';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import buildApiResponse from '../common/api/buildApiResponse';
import { CustomError } from '../errors/CustomError';

function errorHandler(
    error: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) {

    if (error instanceof BadGateWayError) {
        response.locals.error = error
        return buildApiResponse(response, error.status, false)
    }

    if (error instanceof BadRequestError) {
        response.locals.error = error
        return buildApiResponse(response, error.status, false, "Error")
    }

    if (error instanceof ResourceNotFoundError) {
        response.locals.error = error
        return buildApiResponse(response, error.status, false, "Error")
    }

    if (error instanceof CustomError) {
        response.locals.error = error
        return buildApiResponse(response, error.status, false)
    }

    response.locals.error = error;
    buildApiResponse(response, 500, false, "Error")


}
export default errorHandler;