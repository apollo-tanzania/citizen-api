import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the history of the verifications of the stolen phone reports.
const LawEnforcementUnverificationHistorySchema = new Schema({
    officerId: {
        type: String,
        ref: 'lawEnforcement',
        required: true
    },
    unverifiedBy: {
        type: String,
        ref: 'user', // supposed to be admin
        required: true
    }
}, { timestamps: true });
const LawEnforcementUnverificationHistoryModel = model('lawEnforcementVerificationHistory', LawEnforcementUnverificationHistorySchema);
export default LawEnforcementUnverificationHistoryModel;