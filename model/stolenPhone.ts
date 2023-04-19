import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Store information about the phones that have been reported as stolen or lost
const StolenPhoneSchema = new Schema({
    imei: {
        type: Number,
        maxlength: 15,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    capacity: {
        type: String,
        required: true
    },
    reportedBy:{
        type: String,
        ref: 'user',
        required: false
    }

})
const StolenPhoneModel = model('stolenPhone', StolenPhoneSchema);
export default StolenPhoneModel;