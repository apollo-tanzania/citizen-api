import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const PhoneSchema = new Schema({
    imei: {
        type: Number,
        maxlength: 15,
        required: true
    },
    name: {
        type: String
    },
    brand: {
        type: String
    },
    model: {
        type: String
    },
    manufacturer: {
        type: String
    }
});
const Phone = model('phone', PhoneSchema);
export default Phone;