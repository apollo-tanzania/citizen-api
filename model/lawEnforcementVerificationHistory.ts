import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the history of the verifications of the stolen phone reports.
const LawEnforcementVerificationHistorySchema = new Schema({
    officerId: {
        type: String,
        ref: 'lawEnforcement',
        required: true
    },
    verifiedBy: {
        type: String,
        ref: 'user',
        required: true
    }
}, { timestamps: true });
const LawEnforcementVerificationHistoryModel = model('lawEnforcementVerificationHistory', LawEnforcementVerificationHistorySchema);
export default LawEnforcementVerificationHistoryModel;