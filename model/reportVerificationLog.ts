import { Document, SchemaType } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
import { queryById } from "../repository/utils/createQueryById";
import LostPhoneReportModel from "./report";
import UserModel from "./user";
const { Schema, model } = mongooseService.getMongoose();

interface IReportVerificationLog extends Document {
    reportId: string;
    newVerifiedStatus: boolean;
    reason?: string;
    issuedBy: string;
}
// Stores information about the history of the report verification changes.
const ReportVerificaitonLogSchema = new Schema<IReportVerificationLog>({
    reportId: {
        type: Schema.Types.ObjectId,
        ref: 'report',
        refConditions: {
            active: true
        },
        validate: {
            validator: async function (value: any) {
                const report = (await queryById(LostPhoneReportModel, value))
                return !!report
            },
            message: "Invalid Report ID"
        },
        required: true
    },
    newVerifiedStatus: {
        type: Boolean,
        required: true
    },
    reason: {
        type: String,
        required: false
    },
    issuedBy: {
        type: String,
        ref: 'user',
        refConditions: {
            active: true
        },
        validate: {
            validator: async function (value: any) {
                const user = await queryById(UserModel, value)
                return !!user
            },
            message: "Invalid User ID"
        },
        required: true
    }
}, { timestamps: true });

ReportVerificaitonLogSchema.index({ reportId: 1 })
ReportVerificaitonLogSchema.index({ issuedBy: 1 })

const ReportVerifcaitonLogModel = model<IReportVerificationLog>('reportVerificationLog', ReportVerificaitonLogSchema);
export default ReportVerifcaitonLogModel;