import shortid from 'shortid';
import debug from 'debug';
import ReportModel from '../model/report';
import { PatchReportDto } from '../dto/report/patchReport';
import { PutReportDto } from '../dto/report/putReport';
import { CreateReportDto } from '../dto/report/createReport';
import { ClientSession } from 'mongoose';
import mongooseService from '../common/services/mongoose.service';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';

const log: debug.IDebugger = debug('app:reports-dao');

class ReportRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;

    constructor() {
        log('Created new instance of Report Repository');
    }

    async addReport(reportFields: CreateReportDto) {
        const { startSession } = mongooseService.getMongoose();
        const session: ClientSession = await startSession();

        session.startTransaction(); // Start transaction


        try {
            const report = new this.Report({
                ...reportFields,
            });
            await report.save();

            const stolenPhone = new this.StolenPhone({
                ...reportFields?.phone
            })

            await stolenPhone.save();

            await session.commitTransaction();

            return report?._id;
        } catch (error) {
            
            await session.abortTransaction();
            return error;

        } finally {
            session.endSession();

        }
        // await report.save();
        // return reportId;
    }

    async removeReportById(reportId: string) {
        return this.Report.deleteOne({ _id: reportId }).exec();
    }

    async getReportById(reportId: string) {
        return this.Report.findOne({ _id: reportId }).populate('Report').exec();
    }

    async getReports(limit = 10, page = 0) {
        return this.Report.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateReportById(
        reportId: string,
        reportFields: PatchReportDto | PutReportDto
    ) {
        const existingReport = await this.Report.findOneAndUpdate(
            { _id: reportId },
            { $set: reportFields },
            { new: true }
        ).exec();

        return existingReport;
    }
}

export default new ReportRepository();
