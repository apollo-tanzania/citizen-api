import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// interface IStation extends Document {
//     _id: string;
//     name: string;
//     // place: string;
//     location: string;
// }
// Stores information about law enforcement stations
const StationSchema = new Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        max: 255
    },
    // place
    location: {
        type: String,
        required: true,
        max: 255
    },
}, { timestamps: true })

const StationModel = model('station', StationSchema);
export default StationModel;