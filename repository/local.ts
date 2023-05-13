import shortid from 'shortid';
import debug from 'debug';
import { CreateUserDto } from '../dto/createUser';
import { PatchLawEnforcementDto } from '../dto/lawEnforcement/patchLawEnforcement';
import { PutLawEnforcementDto } from '../dto/lawEnforcement/putLawEnforcement';
import { PermissionFlag, Role } from '../common/middleware/common.permissionflag.enum';
import UserModel from '../model/user';
import AdminModel from '../model/admin';
import mongooseService from '../common/services/mongoose.service';
import { ClientSession } from 'mongoose';
import LawEnforcementModel from '../model/lawEnforcement';
import { CreateLawEnforcementDto } from '../dto/lawEnforcement/createLawEnforcement';
import LawEnforcementVerificationHistoryModel from '../model/lawEnforcementVerificationHistory';
import { CreateLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/createLawEnforcementVerificationHistory';
import { CreateLawEnforcementUnverificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/createLawEnforcementUnverificationHistory';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';
import LocalModel from '../model/local';


const log: debug.IDebugger = debug('app:lawEnforcements-dao');

class LocalRepository {

    User = UserModel;
    Admin = AdminModel;
    LawEnforcement = LawEnforcementModel;
    LawEnforcementVerificationHistory = LawEnforcementVerificationHistoryModel;
    Local = LocalModel;

    constructor() {
        log('Created new instance of Local repository');
    }

    async addLocal(localFields: CreateLawEnforcementDto) {
        const session: ClientSession = await mongooseService.getMongoose().startSession();

        session.startTransaction(); // Start transaction

        try {

            const userId = shortid.generate();
            const user = new this.User({
                _id: userId,
                ...localFields,
            });

            const savedUser = await user.save();

            let local;

            if (localFields.permissionFlags) {
                local = new this.Local({
                    username: savedUser?._id,
                    station: localFields.station,
                    badgeNumber: localFields.badgeNumber,
                    permissionFlags: localFields.permissionFlags,
                })
            } else {
                local = new this.Local({
                    username: savedUser?._id,
                    station: localFields.station,
                    badgeNumber: localFields.badgeNumber,
                    permissionFlags: localFields.permissionFlags ?? PermissionFlag.LOCAL_PERMISSION,
                })
            }

            await local.save();

            await session.commitTransaction();

            return local;

        } catch (error) {
            // Rollback the transaction i.e rollback any changes made to the database
            await session.abortTransaction();
            throw error;

        } finally {
            // Ending sesion
            session.endSession()
        }

    }

    async getLocalByEmail(email: string) {

        try {
            const user = await this.User.findOne({ email: email, role: Role.LOCAL }).exec()

            return this.Local.findOne({ username: user?._id }).exec();

        } catch (error) {
            throw error;
        }
    }

    async removeLocalById(localId: string) {
        return this.Local.deleteOne({ username: localId }).exec();
    }

    async getLocalById(localId: string) {
        return this.Local.findOne({ username: localId }).populate('username').exec();
    }

    async getLocals(queryParams: QueryParams) {
        return queryWithPagination(this.Local, queryParams)
    }

    async updateLocalIdById(
        localId: string,
        localFields: PatchLawEnforcementDto | PutLawEnforcementDto
    ) {

        try {
            const local = await this.Local.findOneAndUpdate(
                { username: localId },
                { $set: localFields },
                { new: true, runValidators: true }
            ).exec();

            return local._id;
        } catch (error) {
            return error
        }
    }

    
    // async updatePropertiesIdById(
    //     localId: string,
    //     localFields: PatchLawEnforcementDto | PutLawEnforcementDto
    // ) {

    //     try {
    //         const local = await this.Local.findOneAndUpdate(
    //             { username: localId, 'phones.name': modelName, 'phones.imeis': localFields.oldImei },
    //             { $set: {'phones.$.imeis.$' : localFields.newImei} },
    //             { new: true, runValidators: true }
    //         ).exec();

    //         return local._id;
    //     } catch (error) {
    //         return error
    //     }
    // }

}

export default new LocalRepository();
