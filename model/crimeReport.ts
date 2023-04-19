import {  CrimesList } from "../common/middleware/common.permissionflag.enum";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const CrimeReportSchema = new Schema({
    reporterId: {
        type: Schema.Types.String,
        ref: 'user',
    },
    stationId: {
        type: Schema.Types.String,
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

