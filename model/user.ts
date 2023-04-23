import { PermissionFlag, Role } from "../common/middleware/common.permissionflag.enum";
import mongooseService from "../common/services/mongoose.service";

const Schema = mongooseService.getMongoose().Schema;

const userSchema = new Schema({
    _id: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
        select: false
    },
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    middleName: {
        type: String,
        required: false,
        minLength: 3,
        maxLength: 30
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    role: {
        type: String,
        enum: [Role.ADMIN, Role.CITIZEN, Role.LAW_ENFORCEMENT],
        default: Role.CITIZEN
    },
    // permissionFlags: Number,
}, { _id: false, id: false });

const UserModel = mongooseService.getMongoose().model('user', userSchema);
export default UserModel;