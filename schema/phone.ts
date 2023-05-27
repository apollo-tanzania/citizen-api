import mongooseService from "../common/services/mongoose.service";
import { Property } from "../types";

const { Schema } = mongooseService.getMongoose();


interface IPhone extends Property {
    model: string;
    imeis: string[];
}

export const phoneSchema = new Schema<IPhone>({
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true
    },
    imeis: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        required: false
    }
})