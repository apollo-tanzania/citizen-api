import { HistoryType } from "../common/enums";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the history of the verifications of the stolen phone reports.
const LawEnforcementVerificationHistorySchema = new Schema({
    officerId: {
        type: String,
        ref: 'lawEnforcement',
        refConditions: {
            active: true
        },
        validate: {
            validator: async function (value: string) {
                const User = model("user");
                const user = await User.findById(value)
                return !!user;
            },
            message: "Invalid law enforcement ID"

        },
        required: true
    },
    type: {
        type: String,
        enum: [HistoryType.VERIFICATION, HistoryType.UNVERIFICATION],
        default: HistoryType.VERIFICATION
    },
    reasonForUnverification:{
        type: String,
        required: false
    },
    authorizedBy: {
        type: String,
        ref: 'user',
        refConditions: {
            active: true
        },
        validate: {
            validator: async function (value: string) {
                const User = model("user");
                const user = await User.findById(value)
                return !!user;
            },
            message: "Invalid user ID"
        },
        required: true
    }
}, { timestamps: true });

LawEnforcementVerificationHistorySchema.index({ officerId: 1 })
LawEnforcementVerificationHistorySchema.index({ verifiedBy: 1 })

const LawEnforcementVerificationHistoryModel = model('lawEnforcementVerificationHistory', LawEnforcementVerificationHistorySchema);
export default LawEnforcementVerificationHistoryModel;