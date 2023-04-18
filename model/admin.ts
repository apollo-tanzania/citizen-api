import mongooseService from "../common/services/mongoose.service";
const { Schema, model } = mongooseService.getMongoose();

const adminSchema = new Schema({
    username: {
        type: Schema.Types.String,
            ref: 'user',
            required: true,
            unique: true
    },
    permissionFlags: Number,
});

const AdminModel = model('admin', adminSchema);
export default AdminModel;