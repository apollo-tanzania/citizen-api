import { ObjectId, Types } from "mongoose";
import { customObject } from "../../types";
import express from "express";

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
 * @param imei 15 characters of digits. E.g 723746819237237
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

/**
 * Returns a number representing device IMEI, otherwise returns null
 * @param TAC abbreviation for man
 * @param SNR abbreviation for serial number which represents the manufacturer unique device identity
 * @param CD abbreviation for checkdigit or can also be refered to as checksum
 */
export function generateImeiId(TAC: number, SNR: number, CD: number) {
    try {
        // Cast to string
        let tac = TAC.toString();
        let serial = SNR.toString();
        let checksum = CD.toString()

        // Sanitize

        // Concatenation
        let IMEIString = tac + serial + checksum;

        //Sanitize
        IMEIString.trim()

        // Check if the IMEI is valid
        const isValid = validateIMEINumber(IMEIString)

        if (!isValid) return null

        // Convert IMEI to number
        const IMEI = Number(IMEIString)

        return IMEI;
    } catch (error) {
        return null
    }

}

/**
 * Returns a 15 digit number representing device IMEI, otherwise returns null
 * @param TAC abbreviation for man
 * @param SNR abbreviation for serial number which represents the manufacturer unique device identity
 * @param CD abbreviation for checkdigit or can also be refered to as checksum
 */
export function generateImei(TAC: number, SNR: number, CD: number) {
    try {
        // Cast to string
        let tac = TAC.toString();
        let serial = SNR.toString();
        let checksum = CD.toString()

        // Sanitize

        // Concatenation
        let IMEIString = tac + serial + checksum;

        //Sanitize
        IMEIString.trim()

        // Check if the IMEI is valid other words if it passes Luhn's algorithm
        const isValid = validateIMEINumber(IMEIString)

        if (!isValid) return null

        // Convert IMEI to number
        const IMEI = Number(IMEIString)

        return IMEI;
    } catch (error) {
        return null
    }

}

/**
 * Compares two objects for similarity, and returns true if they are similar, otherwise false
 * @param firstObject 
 * @param secondObject 
 * @param keysToCompare 
 * @returns 
 */
export function compareObjects(firstObject: any, secondObject: any, keysToCompare: string[]) {

    if (typeof firstObject !== 'object' || typeof secondObject !== 'object') {
        return firstObject === secondObject;
    }

    for (const key in firstObject) {

        if (!keysToCompare.includes(key)) {
            continue; // ignore
        }

        const firstObjectValue = firstObject[key]
        const secondObjectValue = secondObject[key]

        if (typeof firstObjectValue === 'object' && typeof secondObjectValue === 'object') {

            if (!compareObjects(firstObjectValue, secondObjectValue, keysToCompare)) {
                return false;
            }
        } else if (firstObjectValue !== secondObjectValue) {
            return false;
        }
    }
    return true
}

export function fieldMatchValidator(value: any, arr: any[]) {
    return arr.some(item => item === value)
}

/**
 * Deletes props except those chosen
 * @param object 
 * @param keysToKeep 
 */
export function deletePropsExcept(object: customObject, keysToKeep: string[]) {
    for (let prop in object) {
        if (!keysToKeep.includes(prop)) {
            delete object[prop]
        }
    }
}

export function isValueRepeated(value: any, arr: any[]) {
    return arr.some(item => item === value)
}

export function validateFields(value: any, { req }: customObject) {
    const { phone, ...otherFields } = req?.body

    if (!phone?.imei1) {
        throw new Error(`Imei is required`)
    }

    if (phone?.imei3 && !phone?.imei1) {
        throw new Error(`Imei2 is required`)
    }

    return true;
}

/**
 * Returns a value of the key
 * @param object 
 * @param keyString 
 */
export function getObjectValue(object: any, keyString: string) {
    // the separator is ][
    const keys = keyString.split(/[\[\]\.]+/).filter(key => key !== '')

    let value = object;
    for (const key of keys) {
        if (!value.hasOwnProperty(key)) {
            return undefined;
        }
        value = value[key];
    }
    return value;
}

/**
 * Returns true if the values are unique, false otherwise
 * @param arr 
 * @returns 
 */
export function isArrayContainsUniqueValues(arr: string[]) {
    try {
        const set = new Set(arr)
        return set.size === arr.length 
    } catch (error) {
        throw error
    }

}

export function paddedNumber(value: number, expectedNumberLength: number) {
    try {
        let paddedNumber = ''
        const number: string = value.toString() // convert the value to string
        const expectedLength = expectedNumberLength;

        if (number.length < expectedLength) {
            const difference = expectedLength - number.length
            // const paddedNumber = '0'.repeat(difference) + number;
            paddedNumber = number.padStart(expectedLength, '0')

            // return padded number in string type
            return paddedNumber
        }

        // if no difference spotted between value length and expected length, then return the original value
        return value
    } catch (error) {
        throw error;
    }

}