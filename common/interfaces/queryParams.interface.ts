import { FilterQuery } from "mongoose";

export interface QueryParams {
    page?: number;
    limit?: number;
    filter?: FilterQuery<{}>;
    sort?: Record<string, unknown>;
}