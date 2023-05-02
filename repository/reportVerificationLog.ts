import debug from 'debug';
import ReportModel from '../model/report';
import { PatchPhoneDto } from '../dto/phone/patchPhone';
import { PutPhoneDto } from '../dto/phone/putPhone';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import PhoneModel from '../model/phone';
import ReportVerifcaitonLogModel from '../model/reportVerificationLog';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';
import { PatchReportVerificationLogDto } from '../dto/reportVerificationLog/patchReportVerificationLog';
import { PutReportVerificationLogDto } from '../dto/reportVerificationLog/putReportVerificationLog';


const log: debug.IDebugger = debug('app:permissions-dao');

class ReportVerificationLogRepository {

    Report = ReportModel;
    ReportVerificationLog = ReportVerifcaitonLogModel;

    constructor() {
        log('Created new instance of Report Verification Log Repository');
    }

    async addReportVerificaionLog(reportVerificationLogFields: CreatePhoneDto) {
        const reportVerificationLog = new this.ReportVerificationLog({
            ...reportVerificationLogFields,
        });

        await reportVerificationLog.save();

        return reportVerificationLog?._id;
    }

    async removePermissionLogById(reportVerificationLogId: string) {
        return this.ReportVerificationLog.deleteOne({ _id: reportVerificationLogId }).exec();
    }

    async getPermissionLogById(reportVerificationLogId: string) {
        return this.ReportVerificationLog.findOne({ _id: reportVerificationLogId }).exec();
    }

    async getPermissionLogs(queryParams: QueryParams) {
        return queryWithPagination(this.ReportVerificationLog, queryParams)
    }

    async updatePermissionById(
        reportVerificationLogId: string,
        reportVerificationLogFields: PatchReportVerificationLogDto | PutReportVerificationLogDto
    ) {
        const updatedReportVerificationLog = await this.ReportVerificationLog.findOneAndUpdate(
            { id: reportVerificationLogId },
            { $set: reportVerificationLogFields },
            { new: true }
        ).exec();

        return updatedReportVerificationLog;
    }
}

export default new ReportVerificationLogRepository();
