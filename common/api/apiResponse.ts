import { Response } from "express";

/**
 * Global method to send API response
 * @param response
 * @param statusCode
 */

function apiResponse(response: Response, statusCode: number = 200) {

    let responseObject: Record<any, any> = {}
    responseObject = response.locals?.data;

    response.status(statusCode).send(responseObject)

}

export default apiResponse