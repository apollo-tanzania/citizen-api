import ReportRepository from '../repository/report';
import { CRUD } from '../common/interfaces/crud.interface';
import { PutReportDto } from '../dto/report/putReport';
import { PatchReportDto } from '../dto/report/patchReport';
import { CreateReportDto } from '../dto/report/createReport';
import { QueryParams } from '../repository/utils/createPaginatedQuery';
import { PatchReportVerificationLogDto } from '../dto/reportVerificationLog/patchReportVerificationLog';

class ReportService implements CRUD {
    async create(resource: CreateReportDto) {
        // return ReportRepository.addReport(resource);
        return ReportRepository.saveReport(resource);
    }

    async deleteById(id: string) {
        return ReportRepository.removeReportById(id);
    }

    async list(queryParams: QueryParams) {
        return ReportRepository.getReports(queryParams);
    }

    async patchById(id: string, resource: PatchReportDto): Promise<any> {
        return ReportRepository.updateReportById(id, resource);
    }

    async putById(id: string, resource: PutReportDto): Promise<any> {
        return ReportRepository.updateReportById(id, resource);
    }

    async readById(id: string) {
        return ReportRepository.getReportById(id);
    }

    async approveById(id: string, resource: PatchReportVerificationLogDto): Promise<any> {
        return ReportRepository.approveReport(id, resource);
    }

    async disapproveById(id: string, resource: PatchReportVerificationLogDto): Promise<any> {
        return ReportRepository.disapproveReport(id, resource);
    }
}

export default new ReportService();
