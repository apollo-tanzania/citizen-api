import { ObjectId, Types } from "mongoose";

/**
 * Returns true if the object is empty, otherwise false
 * 
 * @param object 
 * @returns 
 */
export function isObjectEmpty(object: object) {
    // Check if object is null or undefined
    if (object === null) {
        true
    }

    // Check if object has any own enumerable properties
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            return false;
        }
    }

    // Check if object has any non-own enumerable properties
    const ownProperties = Object.getOwnPropertyNames(object);
    if (ownProperties.length > 0) {
        return false;
    }

    // the object is empty
    return true;

}

/**
 * JSON Object parser
 * @param jsonString 
 * @returns 
 */
export function parseJSON(jsonString: string) {
    try {

        const data = JSON.parse(jsonString);
        return data;
    } catch (error) {
        return null
    }
}

/**
 * Extracts the query parameters from request sanitizes the data and returns formatted object, otherwise returns null
 * @param query 
 * @returns 
 */
export default function extractParamsFromQuery(query: Record<string, any>) {

    let filterQuery = {};
    let limitNumber = 10;
    let pageNumber = 1;
    let sortQuery = {}

    try {
        if (!isObjectEmpty(query)) {
            let { limit, page, filter, sort } = query;

            if (Number(page) < 0 || Number(limit) < 0) return null;

            limitNumber = limit ? parseInt(limit) : 10; // set the limit default to 10
            pageNumber = page ? parseInt(page) : 1; // set to default 1 if page not specified
            delete query.limit;
            delete query.page;
            filterQuery = filter ? JSON.parse(filter) : {};
            sortQuery = sort ? JSON.parse(sort) : {};
            delete query.filter;
            delete query.sort;
        }

        return { filter: filterQuery, page: pageNumber, limit: limitNumber, sort: sortQuery }

    } catch (error) {
        return null
    }
}

/**
 * Returns new ObjectId instance, otherwise returns null
 * 
 * NB: It works if the id is a mongo ObjectId instance only
 * @param id 
 * @returns 
 */
export function createMongooseObjectIDInstance(id?: string | number | Types._ObjectId | undefined) {
    try {
        const objectIdInstance = new Types.ObjectId(id)
        return objectIdInstance ? objectIdInstance : null
    } catch (error) {
        return null
    }
}

/**
 * Returns true if the given number is valid IMEI, otherwise false
 * @param imei 
 * @returns 
 */
export function validateIMEINumber(imei: string) {
    try {
        // Remove all non-numeric characters
        imei = imei.replace(/[^0-9]/g, '')

        if (imei.length !== 15) {
            return false
        }

        // Luhn's algorithm
        const sum = imei
            // Remove the last digit
            .slice(0, -1)
            // Separate the digits
            .split('')
            //Starting from the rightmost digit, double every second digit
            .map((digit, index) => {
                const num = parseInt(digit, 10)
                return index % 2 === 0 ? num : num * 2
            })
            // if the double digit is greater than 9, add two digits together to get as single digit.
            // Then sum up the digits
            .reduce((sum, digit) => sum + (digit > 9 ? digit - 9 : digit))

        //checksum digit is the number to be added for the sum to reach rounded off nearest ten
        const checksum = (10 - (sum % 10)) % 10;
        // compare
        return parseInt(imei.slice(-1), 10) === checksum

    } catch (error) {
        return false
    }
}
