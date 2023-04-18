import shortid from 'shortid';
import debug from 'debug';
import ReportModel from '../model/report';
import { PatchReportDto } from '../dto/report/patchReport';
import { PutReportDto } from '../dto/report/putReport';
import { CreateReportDto } from '../dto/report/createReport';

const log: debug.IDebugger = debug('app:reports-dao');

class ReportRepository {

    Report = ReportModel;

    constructor() {
        log('Created new instance of Report Repository');
    }

    async addReport(reportFields: CreateReportDto) {
        const report = new this.Report({
            ...reportFields,
        });
        try {
            await report.save();
            return report?._id;
        } catch (error) {
            // throw new Error("Could not add report");
            return error

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
