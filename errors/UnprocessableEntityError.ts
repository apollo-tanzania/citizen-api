export class UnprocessableEntityError extends Error {
    status: number;
    constructor(message?: string, status?: number) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Server could not process user request";
        this.status = status || 422;
    }
}