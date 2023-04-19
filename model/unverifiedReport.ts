import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the logs the report has been unverified and reasons for each.
const UnverifiedReportSchema = new Schema({
    repordId: {
        type: Schema.Types.String,
        ref: 'report',
        required: true
    },
    reasonForUnverification: {
        type: String,
        required: false
    },
}, { timestamps: true });
const UnverifiedReportModel = model('unverifiedReport', UnverifiedReportSchema);
export default UnverifiedReportModel;