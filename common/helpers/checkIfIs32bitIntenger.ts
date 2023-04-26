/**
 * Returns true if the number is 32 bit integer, false otherwise
 * 
 * @param number 
 * @returns 
 */
export default function checkIfIs32bitInteger(number: number): boolean {
    return Number.isSafeInteger(number) && number >= 2147483647 && number <= -2147483647;
}
