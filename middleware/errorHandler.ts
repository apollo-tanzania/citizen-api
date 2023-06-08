import express from 'express';
import { BadGateWayError } from '../errors/BadGateWayError';
import { BadRequestError } from '../errors/BadRequestError';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import buildApiResponse from '../common/api/buildApiResponse';
import { CustomError } from '../errors/CustomError';
import { Error } from 'mongoose';
import { ConflictError } from '../errors/ConflictError';
import { UnprocessableEntityError } from '../errors/UnprocessableEntityError';
import mongooseService from '../common/services/mongoose.service';

function errorHandler(
    error: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) {
    try {
        if (error instanceof BadGateWayError) {
            response.locals.error = error
            return buildApiResponse(response, error.status, false)
        }
    
        if (error instanceof BadRequestError) {
            response.locals.error = error
            return buildApiResponse(response, error.status, false)
        }
    
        if (error instanceof ResourceNotFoundError) {
            response.locals.error = error
            return buildApiResponse(response, error.status, false)
        }
    
        if (error instanceof CustomError) {
            response.locals.error = error
            return buildApiResponse(response, error.status, false)
        }

        if (error instanceof UnprocessableEntityError) {
            response.locals.error = error
            return buildApiResponse(response, error.status, false)
        }
    
        if (error instanceof ConflictError) {
            response.locals.error = error
            return buildApiResponse(response, error.status, false)
        }
    
        if (error instanceof Error.CastError) {
            response.locals.error = error
            return buildApiResponse(response, 422, false)
        }
    
        if (error instanceof Error.ValidationError) {
            response.locals.error = error
            return buildApiResponse(response, 422, false)
        }
    
        if (error instanceof Error.ValidatorError) {
            response.locals.error = error
            return buildApiResponse(response, 422, false)
        }
    
        if (error instanceof Error.DocumentNotFoundError) {
            response.locals.error = error
            return buildApiResponse(response, 404, false)
        }
    
        // if (error instanceof Error.DisconnectedError) {
        //     response.locals.error = error
        //     return buildApiResponse(response, 500, false)
        // }
    
        // Checks request body syntax errors
        if (error instanceof SyntaxError && 'statusCode' in error && 'body' in error) {
            response.locals.error = error
            return buildApiResponse(response, 400, false)
        }
    
        if (error instanceof mongooseService.getMongoose().Error) {
            response.locals.error = error
            return buildApiResponse(response, 500, false)
        }

        response.locals.error = error;
        buildApiResponse(response, 500, false, "Error")

        
    } catch (error) {
        response.locals.error = error;
        buildApiResponse(response, 500, false, "Error")
    }

   
}
export default errorHandler;