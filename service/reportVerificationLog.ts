import ReportVerificationLogRepository from '../repository/reportVerificationLog';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class ReportVerificationLogService implements CRUD {

    async create(resource: CreatePhoneDto) {
        return ReportVerificationLogRepository.addReportVerificationLog(resource);
    }

    async deleteById(id: string) {
        return ReportVerificationLogRepository.removeReportVerificationLogById(id);
    }

    async list(queryParams: QueryParams) {
        return ReportVerificationLogRepository.getReportVerificationLogs(queryParams);
    }

    async patchById(id: string, resource: any): Promise<any> {
        return ReportVerificationLogRepository.updateReportVerificationLogById(id, resource);
    }

    async putById(id: string, resource: any): Promise<any> {
        return ReportVerificationLogRepository.updateReportVerificationLogById(id, resource);
    }

    async readById(id: string) {
        return ReportVerificationLogRepository.getReportVerificationLogById(id);
    }
}

export default new ReportVerificationLogService();
