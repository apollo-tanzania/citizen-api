import express from 'express';

function errorHandler(
    err: any,
    res: express.Response,
    next: express.NextFunction
) {
    res.status(400).send(err)
}
export default errorHandler;