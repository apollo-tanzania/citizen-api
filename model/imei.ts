import { Document, Types } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

export interface IImei extends Document {
    id: number;
    tac: number;
    serial: number;
    checkDigit: number;
    valid: boolean | null,
    deviceId: number | null;
    deviceImageUrl: string | null;
    deviceSpecification: {
        simSlots: number | null;
        operatingSystem: string | null;
        operatingSystemFamily: string;
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
    modelName: string;
    models: string[];
    manufacturer: string;
    deviceType: string;
    frequency: string[] | null;
    blackListStatus: boolean | null;
}

const ImeiSchema = new Schema<IImei>({
    _id: {
        type: Number,
        maxlength: 15,
        required: true
    },
    tac: {
        type: Number,
        maxlength: 8,
        required: true
    },
    serial: {
        type: Number,
        maxlength: 7,
        required: true
    },
    checkDigit:  {
        type: Number,
        maxlength: 1,
        required: true
    },
    isValid: {
        type: Boolean,
        default: null
    },
    deviceSpecification: {
        simSlots: {
            type: Number,
            default: 1
        },
        operatingSystem: {
            type: Types.Array<String>,
            default: null,
            required: true

        },
        operatingSystemFamily: String,
        aliases: {
            type: Types.Array<String>,
            default: null,
            required: true
        },
        bluetooth: {
            type: Types.Array<String>,
            default: null,
            required: true
        },
        usb: {
            type: Types.Array<String>,
            default: null,
            required: true
        },
        wlan: {
            type: Types.Array<String>,
            default: null,
            required: true
        },
        nfc: {
            type: Types.Array<String>,
            default: null,
            required: true
        },
        speed: {
            type: Types.Array<String>,
            default: null,
            required: true
        },
        nettech: {
            type: Types.Array<String>,
            default: null,
            required: true
        },
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    models:{
        type: Types.Array<String>,
        default: null,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    deviceType: String,
    frequency:{
        type: Types.Array<String>,
        default: null,
        required: true
    },
    blackListStatus: {
        type: Boolean,
        default: null,
        required: true
    },
});
const ImeiModel = model<IImei>('imei', ImeiSchema);
export default ImeiModel;