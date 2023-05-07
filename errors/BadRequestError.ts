export class BadRequestError extends Error {
    status: number;
    constructor(message?: string, status?: number) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Invalid user input";
        this.status = status || 400;
    }
}