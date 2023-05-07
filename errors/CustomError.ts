export class CustomError extends Error {
    status: number;
    constructor(name?: string, message?: string, status?: number) {
        super();
        this.name = name || "Error";
        this.message = message || "Server error";
        this.status = status || 500;
    }
}