import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the searches made for the stolen phones.
const SearchHistorySchema = new Schema({
    imeiNumber: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    searchedBy: {
        type: String,
        ref: 'user',
        required: true
    }
}, { timestamps: true });
const SearchHistoryModel = model('searchHistory', SearchHistorySchema);
export default SearchHistoryModel;