import { Document, Types } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

export interface IImei extends Document {
    number: string;
    tac: number | string;
    serial: number | string;
    checkDigit: number | string;
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
    type?: string;
    models: string[];
    manufacturer: string;
    deviceType: string;
    frequency: string[] | null;
    blackListStatus: boolean | null;
}

const ImeiSchema = new Schema<IImei>({
    number: {
        type: String,
        maxlength: 15,
        minlength: 15,
        required: true,
        unique: true,
        validate: {
            validator: function (value: number | string) {
                return /^\d{15}$/.test(String(value));
            },
            message: (props: { value: string; }) => `${props.value} is not a valid IMEI`
        }
    },
    tac: {
        type: String,
        maxlength: 8,
        minLength: 8,
        required: true,
        validate: {
            validator: function (value: number | string) {
                return /^\d{8}$/.test(String(value));
            },
            message: (props: { value: string; }) => `${props.value} is not a valid TAC`
        }
    },
    serial: {
        type: String,
        maxlength: 6,
        minlength: 6,
        required: true,
        validate: {
            validator: function (value: number | string) {
                return /^\d{6}$/.test(String(value));
            },
            message: (props: { value: string; }) => `${props.value} is not a valid serial number`
        }
    },
    checkDigit: {
        type: String,
        maxlength: 1,
        minlength: 1,
        required: true,
        validate: {
            validator: function (value: number | string) {
                return /^\d{1}$/.test(String(value));
            },
            message: (props: { value: string; }) => `${props.value} is not a valid check digit`
        }
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
    type: {
        type: String,
        enum: ["primary", "secondary"],
        default: "primary"
    },
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
ImeiSchema.index({number: 1})
const ImeiModel = model<IImei>('imei', ImeiSchema);
export default ImeiModel;