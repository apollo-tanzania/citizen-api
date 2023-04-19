import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the history of the verifications of the stolen phone reports.
const VerificationHistorySchema = new Schema({
    reportId: {
        type: Schema.Types.ObjectId,
        ref: 'report',
        required: true
    },
    verifiedBy: {
        type: String,
        ref: 'lawEnforcement',
        required: true
    },
    verificationDate: {
        type: String
    },
    stationId: {
        type: Schema.Types.ObjectId,
        ref: 'station',
        required: true
    }
}, { timestamps: true });
const VerificationHistoryModel = model('verificationHistory', VerificationHistorySchema);
export default VerificationHistoryModel;