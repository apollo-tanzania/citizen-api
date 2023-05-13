import mongooseService from "../common/services/mongoose.service";

const { Schema } = mongooseService.getMongoose();

interface IPhoneImei {
    number: string;
}
export const phoneImeiSchema = new Schema<IPhoneImei>({
    number: {
        type: String,
        required: true
    }
})