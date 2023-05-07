export class InternalServerError extends Error {
    status: number;
    constructor(message?: string, status?: number){
        super();
        this.name = this.constructor.name;
        this.message = message || "Internal server error";
        this.status = status || 500;
    }
}