import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const StationSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        max: 255
    },
    location: {
        type: String,
        required: true,
        max: 255
    },
}, { timestamps: true })

const Station = model('station', StationSchema);
export default Station;