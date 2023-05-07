export class ResourceNotFoundError extends Error {
    status: number;
    constructor(message?: string | undefined, status?: number){
        super();
        this.name = this.constructor.name;
        this.message = message || "Resource not found";
        this.status = status || 500;
    }
}