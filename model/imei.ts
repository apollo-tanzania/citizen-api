import { Document, Types } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

export interface IImei extends Document {
    tac: number;
    serial: number;
    checkDigit: number;
    valid: boolean | null,
    deviceId: number | null;
    deviceImageUrl: string | null;
    deviceSpecification: {
        simSlots: number | null;
        operatingSystem: string | null;
        operatingSystemFamily: string | null;
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
    // to avoid conflict with existing properties for mongoose, model and modelName properties
    _model: string;
    models: string[];
    manufacturer: string;
    deviceType: string;
    frequency: string[] | null;
    blackListStatus: boolean | null;
}

const ImeiSchema = new Schema<IImei>({
    number: {
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
    checkDigit: {
        type: Number,
        maxlength: 1,
        required: true
    },
    valid: {
        type: Boolean,
        default: null
    },
    deviceSpecification: {
        simSlots: {
            type: Number,
            default: 1
        },
        operatingSystem: {
            type: String,
            default: null,
        },
        operatingSystemFamily: {
            type: String,
            default: null,
        },
        aliases: {
            type: [String],
            default: null,
            // required: true
        },
        bluetooth: {
            type: [String],
            default: null,
        },
        usb: {
            type: [String],
            default: null,
        },
        wlan: {
            type: [String],
            default: null,
        },
        nfc: {
            type: Boolean,
            default: null,
        },
        speed: {
            type: [String],
            default: null,
        },
        nettech: {
            type: [String],
            default: null,
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
    // to avoid conflict with existing properties for mongoose, model and modelName properties
    _model: {
        type: String,
        required: true
    },
    models: {
        type: [String],
        default: null,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    deviceType: String,
    frequency: {
        type: [String],
        default: null,
    },
    blackListStatus: {
        type: Boolean,
        default: null,
        required: true
    },
});
const ImeiModel = model<IImei>('imei', ImeiSchema);
export default ImeiModel;