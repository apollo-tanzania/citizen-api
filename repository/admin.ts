import shortid from 'shortid';
import debug from 'debug';
import { CreateUserDto } from '../dto/createUser';
import { PatchUserDto } from '../dto/patchUser';
import { PutUserDto } from '../dto/putUser';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import UserModel from '../model/user';
import AdminModel from '../model/admin';
import mongooseService from '../common/services/mongoose.service';
import { ClientSession } from 'mongoose';


const log: debug.IDebugger = debug('app:admins-dao');

class AdminRepository {

    User = UserModel;
    Admin = AdminModel;

    constructor() {
        log('Created new instance of Admin repository');
    }

    async addAdmin(adminFields: CreateUserDto) {
        const session: ClientSession = await mongooseService.getMongoose().startSession();

        session.startTransaction(); // Start transaction

        try {

            const userId = shortid.generate();
            const user = await new this.User({
                _id: userId,
                ...adminFields,
            });

            const savedUser = await user.save();

            const admin = await new this.Admin({
                username: savedUser?._id,
                permissionFlags: PermissionFlag.ADMIN_PERMISSION_NOT_ALL_PERMISSIONS,
            })

            await admin.save();

            await session.commitTransaction();

            return admin;

        } catch (error) {
            // Rollback the transaction i.e rollback any changes made to the database
            await session.abortTransaction();
            throw error;

        } finally {
            // Ending sesion
            session.endSession()
        }
      
    }

    async getAdminByEmail(email: string) {
        return this.Admin.findOne({ email: email }).exec();
    }

    async removeAdminById(userId: string) {
        return this.Admin.deleteOne({ _id: userId }).exec();
    }

    async getAdminById(adminId: string) {
        return this.Admin.findOne({ username: adminId }).populate('username').exec();
    }

    async getAdmins(limit = 10, page = 0) {
        return this.Admin.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateAdminById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingAdmin = await this.Admin.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();

        return existingAdmin;
    }
}

export default new AdminRepository();