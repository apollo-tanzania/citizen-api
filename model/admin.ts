import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const adminSchema = new Schema({
    username: {
        type: String,
        ref: 'user',
        required: true,
        unique: true,
    },
    permissionFlags: {
        type: Number,
        default: PermissionFlag.ADMIN_PERMISSION
    },
});

// adminSchema.pre('updateOne', function (next) {
//     const update = this.update()
//     const keys = Object.keys(update)

//     for (const key of keys) {
//         if (update[key] === this[key]) {
//             const err = new Error(` ${key} can not be updated with same value`)
//             return next(err);
//         }
//     }
//     next()
// })

const AdminModel = model('admin', adminSchema);
export default AdminModel;