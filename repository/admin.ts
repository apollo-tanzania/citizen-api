import shortid from 'shortid';
import debug from 'debug';
import { CreateUserDto } from '../dto/createUser';
import { PatchUserDto } from '../dto/patchUser';
import { PutUserDto } from '../dto/putUser';
import { PutPermissionLogDto } from '../dto/permissionLog/putPermissionLog';
import { PatchPermissionLog } from '../dto/permissionLog/patchPermissionLog';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import UserModel from '../model/user';
import AdminModel from '../model/admin';
import mongooseService from '../common/services/mongoose.service';
import { ClientSession } from 'mongoose';
import PermissionLogModel from '../model/permissionLog';
import PermissionModel from '../model/permission';
import Long from 'long'
import e from 'express';

const log: debug.IDebugger = debug('app:admins-dao');

class AdminRepository {

    User = UserModel;
    Admin = AdminModel;
    Permission = PermissionModel;
    PermissionLog = PermissionLogModel

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

            let admin;

            admin = await new this.Admin({
                username: savedUser?._id,
                permissionFlags: adminFields.permissionFlags,

                // permissionFlags: PermissionFlag.ADMIN_PERMISSION_NOT_ALL_PERMISSIONS,
            })

            if (adminFields?.permissionFlags) {
                admin = await new this.Admin({
                    username: savedUser?._id,
                    permissionFlags: adminFields.permissionFlags ?? PermissionFlag.ADMIN_PERMISSION,
                })
            }

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
        try {
            const user = await this.User.findOne({ email: email, role: 'admin' }).exec()

            return await this.Admin.findOne({ username: user?._id }).exec();

        } catch (error) {
            return error;
        }
        // return this.Admin.findOne({ email: email }).exec();
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
        try {
            const existingAdmin = await this.Admin.findOneAndUpdate(
                { username: userId },
                { $set: userFields },
                { new: true, runValidators: true }
            ).exec();

            return existingAdmin;
        } catch (error) {
            return error
        }
    }

    async updateAdminPermissionById(
        userId: string,
        permissionLogFields: PatchPermissionLog | PutPermissionLogDto
    ) {
        const session: ClientSession = await mongooseService.getMongoose().startSession();

        session.startTransaction(); // Start transaction

        try {
            const existingAdmin = await this.Admin.findOneAndUpdate(
                { username: userId },
                { $set: { permissionFlags: permissionLogFields.permissionFlags } },
                { new: false, runValidators: true }
            ).exec();

            let newPermissionFlagLong = Long.fromNumber(permissionLogFields?.permissionFlags as unknown as number)
            let previousPermissionFlagLong = Long.fromNumber(existingAdmin?.permissionFlags)

            let permissionGrantedOrRevokedLong = newPermissionFlagLong.sub(previousPermissionFlagLong) // Convert to Long
            let permissionGrantedOrRevoked = permissionGrantedOrRevokedLong.toNumber(); // Convert to Number 

            if (permissionGrantedOrRevoked === 0) {
                throw new Error(undefined)
            }

            const permission = await this.Permission.findOne({
                flag: Math.abs(permissionGrantedOrRevoked)
            }).exec();

            const permissionLog = await new this.PermissionLog({
                ...permissionLogFields,
                action: permissionGrantedOrRevoked > 0 ? "granted" : "revoked",
                previousPermissionFlag: existingAdmin?.permissionFlags,
                permission: permission._id
            })

            const log = await permissionLog.save();

            await session.commitTransaction()

            return {
                data: {
                    newPermissionFlags: newPermissionFlagLong.toNumber(),
                    permissionDetails: permission,
                    permissionAction: log?.action
                }
            }
        } catch (error) {
            await session.abortTransaction()
            return error
        } finally {
            // Ending sesion
            session.endSession()
        }
    }
}

export default new AdminRepository();
