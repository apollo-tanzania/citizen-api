import {  Document } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model, } = mongooseService.getMongoose();

interface IStolenPhone extends Document {
    imei1: number;
    imei2?: number;
    imei3?: number;
    name: string;
    brand: string;
    modelName: string;
    manufacturer: string;
    color?: string;
    capacity: string; // TODO: change this to storage becasue it makes a lot of sense
    imageUrl?: string
    countReportedStolenOrLost: number;
}
// Store information about the phones that have been reported as stolen or lost
const StolenPhoneSchema = new Schema<IStolenPhone>({
    imei1: {
        type: Number,
        maxlength: 15,
        required: true
    },
    imei2: {
        type: Number,
        maxlength: 15,
        required: false
    },
    imei3: {
        type: Number,
        maxlength: 15,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    capacity: {
        type: String,
        required: true
    },
    countReportedStolenOrLost: {
        type: Number
    }
})
const StolenPhoneModel = model<IStolenPhone>('stolenPhone', StolenPhoneSchema);
export default StolenPhoneModel;