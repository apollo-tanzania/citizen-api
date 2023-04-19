import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about law enforcement officers
const lawEnforcementSchema = new Schema({
    username: {
        type: String,
        ref: 'user',
        required: true
    },
    station: {
        type: String,
        ref: 'station',
        required: true
    },
    permissionFlags: Number,
}, { id: false });

const LawEnforcementModel = model('lawEnforcement', lawEnforcementSchema);
export default LawEnforcementModel;