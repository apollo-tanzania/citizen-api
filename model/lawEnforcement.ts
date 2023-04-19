import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about law enforcement officers
const lawEnforcementSchema = new Schema({
    username: {
        type: String,
        ref: 'user',
        unique: true,
        required: true
    },
    badgeNumber: {
        type: String,
        required: false
    },
    station: {
        type: String,
        ref: 'station',
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    permissionFlags: Number,
}, { id: false });

const LawEnforcementModel = model('lawEnforcement', lawEnforcementSchema);
export default LawEnforcementModel;