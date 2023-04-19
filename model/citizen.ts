import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const CitizenSchema = new Schema({
    username: {
        type: Schema.Types.String,
        ref: 'user',
        required: true
    },
    contact: {
        phone: String,
        email: String

    }
});
const CitizenModel = model('citizen', CitizenSchema);
export default CitizenModel;