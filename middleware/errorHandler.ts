import express from 'express';

function errorHandler(
    error: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) {
    console.log(error);
    response.status(500).send({
        message: "Something went wrong. Try again later",
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack
        }
        
        // name: err.name,
        // message: err.message,
        // error: err?.stack
    })
}
export default errorHandler;