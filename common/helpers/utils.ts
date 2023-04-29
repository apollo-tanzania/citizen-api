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
    let limitNumber = 0;
    let pageNumber = 0;
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