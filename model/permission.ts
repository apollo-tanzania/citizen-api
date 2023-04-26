import { PermissionFlag, Role } from "../common/middleware/common.permissionflag.enum";
import mongooseService from "../common/services/mongoose.service";

const Schema = mongooseService.getMongoose().Schema;

const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    flag: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
}, { timestamps: true });

const PermissionModel = mongooseService.getMongoose().model('permission', permissionSchema);
export default PermissionModel;