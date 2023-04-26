import debug from 'debug';
import UserModel from '../model/user';
import mongooseService from '../common/services/mongoose.service';
import { ClientSession } from 'mongoose';
import LawEnforcementModel from '../model/lawEnforcement';
import LawEnforcementVerificationHistoryModel from '../model/lawEnforcementVerificationHistory';
import { CreateLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/createLawEnforcementVerificationHistory';
import { PatchLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/patchLawEnforcementVerificationHistory';
import { PutLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/putLawEnforcementVerificationHistory';


const log: debug.IDebugger = debug('app:lawEnforcements-dao');

class LawEnforcementVerificationHistoryRepository {

    User = UserModel;
    LawEnforcement = LawEnforcementModel;
    LawEnforcementVerificationHistory = LawEnforcementVerificationHistoryModel;

    constructor() {
        log('Created new instance of Law enforcement verification history repository');
    }

    async addLawEnforcementVerificationHistory(lawEnforcementOfficerVerificationHistoryFields: CreateLawEnforcementVerificationHistoryDto) {
        const session: ClientSession = await mongooseService.getMongoose().startSession();

        session.startTransaction(); // Start transaction

        try {

            const officerToBeVerified = await this.LawEnforcement.findOne({ username: lawEnforcementOfficerVerificationHistoryFields.lawEnforcementId });

            // return officerToBeVerified;
            if (officerToBeVerified?.isVerified) {
                return {
                    message: "Officer already verified",
                    type: "Conflict"
                }
            }

            // update status to verified
            await this.LawEnforcement.findOneAndUpdate(
                { username: officerToBeVerified?.username },
                {
                    $set: {
                        isVerified: true
                    }
                },
                { new: true }
            ).exec();

            const lawEnforcementOfficerVerificationHistory = await new this.LawEnforcementVerificationHistory({
                ...lawEnforcementOfficerVerificationHistoryFields
            })

            await lawEnforcementOfficerVerificationHistory.save();

            await session.commitTransaction();

            return lawEnforcementOfficerVerificationHistory;

        } catch (error) {
            // Rollback the transaction i.e rollback any changes made to the database
            await session.abortTransaction();
            // throw error;
            return error;

        } finally {
            // Ending sesion
            session.endSession()
        }

    }

    async getLawEnforcementVerificationHistoryByEmail(email: string) {

        try {
            const user = await this.User.findOne({ username: email }).exec()

            return this.LawEnforcementVerificationHistory.findOne({ username: user?.username }).exec();

        } catch (error) {
            throw error;
        }
    }

    async removeLawEnforcementVerificationHistoryById(historyId: string) {
        return this.LawEnforcementVerificationHistory.deleteOne({ _id: historyId }).exec();
    }

    async getLawEnforcementVerificationHistoryById(historyId: string) {
        try {
            return this.LawEnforcementVerificationHistory.findOne({ id: historyId }).populate(['officerId', 'verifiedBy']).exec();

        } catch (error) {
            return error;
            
        }
    }

    async getLawEnforcementsVerificationHistory(limit = 10, page = 0) {
        return this.LawEnforcementVerificationHistory.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateLawEnforcementVerificationHistoryIdById(
        historyId: string,
        lawEnforcementVerificationHistoryFields: PatchLawEnforcementVerificationHistoryDto | PutLawEnforcementVerificationHistoryDto
    ) {
        const existingLawEnforcementVerificationHistoryId = await this.LawEnforcementVerificationHistory.findOneAndUpdate(
            { _id: historyId },
            { $set: lawEnforcementVerificationHistoryFields },
            { new: true }
        ).exec();

        return existingLawEnforcementVerificationHistoryId;
    }
}

export default new LawEnforcementVerificationHistoryRepository();
