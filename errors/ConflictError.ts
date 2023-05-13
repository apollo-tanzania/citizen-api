export class ConflictError extends Error {
    status: number;
    constructor(message?: string, status?: number) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Requests conflict with the current state of the server";
        this.status = status || 409;
    }
}