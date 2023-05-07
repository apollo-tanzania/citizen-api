import { FilterQuery, Model } from "mongoose";

export interface QueryParams {
    page?: number;
    limit?: number;
    filter?: FilterQuery<{}>;
    sort?: any;
}

export interface Pagination {
    data: Array<any>,
    totalPages: number,
    currentPage: number,
    totalCount: number,
    perPage: number
}

export interface FoundDocument<T> {
    query: string 
    data: Model<T>,
}

export interface ImeiDbApiErrorResponse {
    message: string
    code: number
    success: boolean
}


export interface ImeiDBApiSuccessResponse {
    query: number
    success: boolean
    data: {
        tac: number;
        serial: number;
        controlNumber: number;
        valid: boolean | null,
        device_id: number | null;
        device_image: string | null;
        device_spec: {
            sim_slots: number | null;
            os: string | null;
            os_family: string;
            aliases: string[] | null,
            bluetooth: string[] | null,
            usb: string[] | null,
            wlan: string[] | null,
            nfc: boolean | null,
            speed: string[] | null,
            nettech: string[] | null
        };
        name: string;
        brand: string;
        model: string;
        models: string[];
        manufacturer: string;
        type: string;
        frequency: string[] | null;
        blacklist: {
            status: boolean | null
        }
    }

}