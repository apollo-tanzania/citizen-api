import { Document } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
import { phoneImeiSchema } from "../schema/imei";
import { ReportStatus } from "../types";
const { Schema, model } = mongooseService.getMongoose();

export interface ILostPhoneReport extends Document {
    stolenPhoneId: string
    phone: {
        imeis:  {
            imei: string
        }[],
        // storage?: number
    };
    incident: {
        date: string
        place: string
        depossession: string
        brief: string
    };
    flags: string
    rb?: string
    verified: boolean
    victim: {
        firstname: string
        middlename: string
        lastname: string
        username?: string
    }
    originalReportId?: string
    status: string
}



const LostPhoneReportSchema = new Schema<ILostPhoneReport>({
    stolenPhoneId: {
        type: Schema.Types.ObjectId,
        ref: 'stolenPhone',
        required: true
    },
    phone: {
        imeis: {
            type: [phoneImeiSchema],
            required: true,
            // default: []
        },
        storage: {
            type: Number,
            maxlength: 4,
            required: false
        }
    },
    incident: {
        date: {
            type: String,
            required: true,
            lowercase: true
        },
        place: {
            type: String,
            required: true
        },
        depossession: {
            type: String,
            enum: ["stolen", "lost", "n/a"],
            default: "n/a",
            required: true
        },
        brief: String
    },
    flags: {
        type: String,
        enum: ["clear", "warning", "caution"],
        default: "caution"
    },
    rb: {
        type: String,
        uppercase: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    victim: {
        firstname: {
            type: String,
            required: true,
        },
        middlename: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        username: {
            type: Schema.Types.String,
            ref: 'user',
            required: false
        },
    },
    originalReportId: {
        type: Schema.Types.ObjectId,
        ref: 'report',
        required: false,
        restrict: true
    },
    status: {
        type: String,
        enum: [ReportStatus.open, ReportStatus.recovered],
        default: ReportStatus.open,
        required: true
    }

}, { timestamps: true });

const LostPhoneReportModel = model<ILostPhoneReport>('report', LostPhoneReportSchema);
export default LostPhoneReportModel;

