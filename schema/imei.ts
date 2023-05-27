import { validateIMEINumber } from "../common/helpers/utils";
import mongooseService from "../common/services/mongoose.service";

const { Schema } = mongooseService.getMongoose();

interface IPhoneImei {
    imei: string;
}
export const phoneImeiSchema = new Schema<IPhoneImei>({
    imei: {
        type: String,
        maxlength: 15,
        minlength: 15,
        // unique: true,
        validate: {
            validator: function (value: number | string) {
                const isCorrectPattern = /^\d{15}$/.test(String(value));
                const isValidIMEI = validateIMEINumber(String(value));
                return (isCorrectPattern && isValidIMEI);
            },
            message: (props: { value: string; }) => `${props.value} is not a valid IMEI`
        }
    }
})