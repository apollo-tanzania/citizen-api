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
export default function extractParamsFromQuery(query : any) {

    let filter = {};
    let _limit = 0;
    let skip = 0;
    let _select = '';

    if (!isObjectEmpty(query)) {
        let { limit, page } = query;
        _limit = Number(limit) || _limit;
        skip = Number(Number(page) - 1) * _limit;
        _select = query.select || _select;
        delete query.limit;
        delete query.page;
        delete query.select;
        filter = query;
    }

    return { filter, skip, limit: _limit, select: _select }
}