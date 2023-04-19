import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about law enforcement stations
const StationSchema = new Schema({
    _id: {
        type: String,
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

const StationModel = model('station', StationSchema);
export default StationModel;