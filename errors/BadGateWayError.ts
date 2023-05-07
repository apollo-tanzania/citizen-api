export class BadGateWayError extends Error {
    status: number;
    constructor(message?:string, status?: number) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Bad Gateway Error";
        this.status = status || 500;

    }
}