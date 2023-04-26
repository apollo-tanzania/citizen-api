import { SchemaType } from "mongoose";
import { permissionAction } from "../common/enums";
import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

// Stores information about the history of the verifications of the stolen phone reports.
const PermissionLogSchema = new Schema({
    userId: {
        type: String,
        ref: 'user',
        refConditions: {
            active: true
        },
        validate: {
            validator: async function (value: string) {
                const User = model("user");
                const user = await User.findById(value)
                return !!user;
            },
            message: "Invalid user ID"

        },
        required: true
    },
    // reasonForUnverifcation: {
    //     type: String,
    //     required: false
    // },
    previousPermissionFlag:{
        type: Number,
        required: true
    },
    permission: {
        type: Schema.Types.ObjectId,
        ref: 'permission',
        refConditions: {
            active: true
        },
        validate: {
            validator: async function (value: any) {
                const Permission = model("permission");
                const permission = await Permission.findById(value)
                return !!permission;
            },
            message: "Invalid permission ID"

        },
    },
    action: {
        type: String,
        enum: [permissionAction.GRANTED, permissionAction.REVOKED],
        required: true
    },
    authorizedBy: {
        type: String,
        ref: 'user',
        refConditions: {
            active: true
        },
        validate: {
            validator: async function (value: string) {
                const User = model("user");
                const user = await User.findById(value)
                return !!user;
            },
            message: "Invalid user ID"
        },
        required: true
    }
}, { timestamps: true });

PermissionLogSchema.index({ userId: 1 })
PermissionLogSchema.index({ authorizedBy: 1 })

const PermissionLogModel = model('permissionLog', PermissionLogSchema);
export default PermissionLogModel;