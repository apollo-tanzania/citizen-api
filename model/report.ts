import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const LostPhoneReportSchema = new Schema({
    phone: {
        imei1: {
            type: Number,
            maxlength: 15,
            required: true
        },
        imei2: {
            type: Number,
            maxlength: 15,
            required: false
        },
        imei3: {
            type: Number,
            maxlength: 15,
            required: false
        }
    },
    incident: {
        date: {
            type: String,
            required: true,
            lowercase: true
        },
        place: {
            type: String,
            required: true
        },
        depossession: {
            type: String,
            enum: ["stolen", "lost", "n/a"],
            default: "n/a",
            required: true
        },
        brief: String
    },
    flags: {
        type: String,
        enum: ["clear", "warning", "caution"],
        default: "caution"
    },
    rb: {
        type: String,
        uppercase: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    victim: {
        firstname: {
            type: String,
            required: true,
        },
        middlename: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        username: {
            type: Schema.Types.String,
            ref: 'user',
            required: false
        },
    },
    originalReportId: {
        type: Schema.Types.ObjectId,
        ref: 'report',
        required: false
    }

}, { timestamps: true });

const LostPhoneReportModel = model('report', LostPhoneReportSchema);
export default LostPhoneReportModel;

