import shortid from 'shortid';
import debug from 'debug';
import { CreateUserDto } from '../dto/createUser';
import { PatchLawEnforcementDto } from '../dto/lawEnforcement/patchLawEnforcement';
import { PutLawEnforcementDto } from '../dto/lawEnforcement/putLawEnforcement';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import UserModel from '../model/user';
import AdminModel from '../model/admin';
import mongooseService from '../common/services/mongoose.service';
import { ClientSession } from 'mongoose';
import LawEnforcementModel from '../model/lawEnforcement';
import { CreateLawEnforcementDto } from '../dto/lawEnforcement/createLawEnforcement';


const log: debug.IDebugger = debug('app:lawEnforcements-dao');

class LawEnforcementRepository {

    User = UserModel;
    Admin = AdminModel;
    LawEnforcement = LawEnforcementModel;

    constructor() {
        log('Created new instance of Law enforcement repository');
    }

    async addLawEnforcement(lawEnforcementOfficerFields: CreateLawEnforcementDto) {
        const session: ClientSession = await mongooseService.getMongoose().startSession();

        session.startTransaction(); // Start transaction

        try {

            const userId = shortid.generate();
            const user = await new this.User({
                _id: userId,
                ...lawEnforcementOfficerFields,
            });

            const savedUser = await user.save();

            let lawEnforcementOfficer;

            if (lawEnforcementOfficerFields.permissionFlags) {
                lawEnforcementOfficer = await new this.LawEnforcement({
                    username: savedUser?._id,
                    station: lawEnforcementOfficerFields.station,
                    badgeNumber: lawEnforcementOfficerFields.badgeNumber,
                    permissionFlags: lawEnforcementOfficerFields.permissionFlags,
                })
            }else{
                lawEnforcementOfficer = await new this.LawEnforcement({
                    username: savedUser?._id,
                    station: lawEnforcementOfficerFields.station,
                    badgeNumber: lawEnforcementOfficerFields.badgeNumber,
                    permissionFlags: PermissionFlag.LAW_ENFORCEMENT_PERMISSIONS,
                })
            }


            // const lawEnforcementOfficer = await new this.LawEnforcement({
            //     username: savedUser?._id,
            //     station: lawEnforcementOfficerFields.station,
            //     badgeNumber: lawEnforcementOfficerFields.badgeNumber,
            //     permissionFlags: PermissionFlag.LAW_ENFORCEMENT_PERMISSIONS,
            // })

            await lawEnforcementOfficer.save();

            await session.commitTransaction();

            return lawEnforcementOfficer;

        } catch (error) {
            // Rollback the transaction i.e rollback any changes made to the database
            await session.abortTransaction();
            throw error;

        } finally {
            // Ending sesion
            session.endSession()
        }

    }

    async getLawEnforcementByEmail(email: string) {

        try {
            const user = await this.User.findOne({ email: email, role: 'law enforcement' }).exec()

            return this.LawEnforcement.findOne({ username: user?._id }).exec();

        } catch (error) {
            throw error;
        }
    }

    async removeLawEnforcementById(lawEnforcementId: string) {
        return this.LawEnforcement.deleteOne({ username: lawEnforcementId }).exec();
    }

    async getLawEnforcementById(lawEnforcementId: string) {
        return this.LawEnforcement.findOne({ username: lawEnforcementId }).populate('username').exec();
    }

    async getLawEnforcements(limit = 10, page = 0) {
        return this.LawEnforcement.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateLawEnforcementIdById(
        lawEnforcementId: string,
        lawEnforcementFields: PatchLawEnforcementDto | PutLawEnforcementDto
    ) {

        try {
            const existingLawEnforcementId = await this.LawEnforcement.findOneAndUpdate(
                { username: lawEnforcementId },
                { $set: lawEnforcementFields },
                { new: true, runValidators: true }
            ).exec();
    
            return existingLawEnforcementId;
        } catch (error) {
            return error
        }
    }
}

export default new LawEnforcementRepository();
