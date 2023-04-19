import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the phones that I have been found adter being reported as stolen
const FoundStolenPhonesSchema = new Schema({
    reportId: {
        type: Schema.Types.ObjectId,
        ref: 'report',
        required: true
    },
    finderId: {
        type: String,
        ref: 'user',
        required: true
    },
    dateFound: {
        type: String,
        required: false
    },
    location: {
        type: String,
    }
}, { timestamps: true });
const FoundStolenPhonesModel = model('foundStolenPhone', FoundStolenPhonesSchema);
export default FoundStolenPhonesModel;