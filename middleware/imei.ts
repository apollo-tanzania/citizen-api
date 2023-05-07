import express from 'express';
import imeiService from '../service/imei';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import { BadRequestError } from '../errors/BadRequestError';
import { isValidObjectId } from 'mongoose';


class ImeiMiddleware {
    async validateImeiExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {

            if (!isValidObjectId(req.params.imeiId)) throw new BadRequestError("Invalid ObjectID", 400);

            // Query the imei with given mongoose ObjectID
            const imei = await imeiService.readById(req.params.imeiId);
            // Check if document returned
            if (!imei) throw new ResourceNotFoundError("Imei not found", 404);

            // If the document exists, continue to the other handlers
            res.locals.imei = imei;
            next();
        } catch (error) {
            next(error)
        }

    }
}
export default new ImeiMiddleware();
