import { Document } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
import { validateIMEINumber } from "../common/helpers/utils";
import { phoneImeiSchema } from "../schema/imei";
const { Schema, model, } = mongooseService.getMongoose();

interface IStolenPhone extends Document {
    imeis: {
        imei: string;
    }[],
    storage: number;
    countReportedStolenOrLost: number;
}
// Store information about the phones that have been reported as stolen or lost
const StolenPhoneSchema = new Schema<IStolenPhone>({
    imeis: {
        type: [phoneImeiSchema],
        required: true,
        minLength: 1
    },
    storage: {
        type: Number,
        maxlength: 4,
        required: false
    },
    countReportedStolenOrLost: {
        type: Number
    }
})
const StolenPhoneModel = model<IStolenPhone>('stolenPhone', StolenPhoneSchema);
export default StolenPhoneModel;