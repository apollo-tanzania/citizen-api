import ReportRepository from '../repository/report';
import { CRUD } from '../common/interfaces/crud.interface';
import { PutReportDto } from '../dto/report/putReport';
import { PatchReportDto } from '../dto/report/patchReport';
import { CreateReportDto } from '../dto/report/createReport';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class ReportService implements CRUD {
    async create(resource: CreateReportDto) {
        return ReportRepository.addReport(resource);
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
}

export default new ReportService();
