import mongooseService from "../common/services/mongoose.service";
import { phoneSchema } from "../schema/phone";
const { Schema, model } = mongooseService.getMongoose();

const LocalSchema = new Schema({
    username: {
        type: String,
        ref: 'user',
        required: true
    },
    contact: {
        phone: String,
        email: String

    },
    phones: {
        type: [phoneSchema],
        default: []
    }
});
const LocalModel = model('local', LocalSchema);
export default LocalModel;