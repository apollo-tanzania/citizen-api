import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const lawEnforcementSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
    },
    station: {
        type: Schema.Types.ObjectId,
            ref: 'station',
            required: true
    },
    permissionFlags: Number,
}, { id: false });

const LawEnforcementModel = model('lawEnforcement', lawEnforcementSchema);
export default LawEnforcementModel;