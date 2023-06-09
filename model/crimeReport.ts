import {  CrimesList } from "../common/enums";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const CrimeReportSchema = new Schema({
    reporterId: {
        type: String,
        ref: 'user',
    },
    stationId: {
        type: String,
        ref: 'station',
        required: false
    },
    crimeType: {
        type: Schema.Types.String,
        enum: CrimesList,
        default: "n/a"
    },
    decription: String,
    status: String

}, { timestamps: true });

const CrimeReportModel = model('crimereport', CrimeReportSchema);
export default CrimeReportModel;

