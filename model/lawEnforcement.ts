import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";
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
        required: true,
        unique: true
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
    permissionFlags: {
        type: Number,
        enum: [PermissionFlag.LAW_ENFORCEMENT_PERMISSIONS, PermissionFlag.LAW_ENFORCEMENT_ADMIN_PERMISSION],
        default: PermissionFlag.LAW_ENFORCEMENT_PERMISSIONS
    },
}, { id: false });

const LawEnforcementModel = model('lawEnforcement', lawEnforcementSchema);
export default LawEnforcementModel;