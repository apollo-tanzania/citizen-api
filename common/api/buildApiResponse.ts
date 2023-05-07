import { Response } from "express";

/**
 * Global method to send API response
 * @param response 
 * @param statusCode 
 * @param success 
 * @param message 
 */
function buildApiResponse(response: Response, statusCode: number = 200, success?: boolean, message?: string): void {


    // Any data from the server to the client. Can be database data or anything
    let data = response.locals?.data; // holds data
    let error = response.locals?.error; // holds error

    if (!data && !success && !message && !error) {
        response.status(statusCode).send()
        return;
    }

    // if error object is not empty, remove status property from it
    if (error) {
       
        if ('status' in error) {
            delete error.status
        }

        // Constructed API response compatible with error handling
        response.status(statusCode).send({
            success: success,
            statusCode: statusCode,
            message: message,
            data,
            error
        })
        return
    }

    // Or else default constructed API response
    response.status(statusCode).send({
        success: success,
        statusCode: statusCode,
        message: message,
        data,
        error
    })
}

export default buildApiResponse