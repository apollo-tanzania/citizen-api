import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Store information about the phones that have been reported as stolen or lost
const StolenPhoneSchema = new Schema({
    imei1: {
        type: Number,
        maxlength: 15,
        required: true
    },
    imei2: {
        type: Number,
        maxlength: 15,
        required: false
    },
    imei3: {
        type: Number,
        maxlength: 15,
        required: false
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
    // reportedBy: {
    //     type: String,
    //     ref: 'user',
    //     required: false
    // },
    countReportedStolen: {
        type: Number,
        defaultValue: 0
    },
    // status: {
    //     type: String,
    //     enum: ['verified', 'unverified'],
    //     default: 'unverified'
    // }

})
const StolenPhoneModel = model('stolenPhone', StolenPhoneSchema);
export default StolenPhoneModel;