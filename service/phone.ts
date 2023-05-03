import PhoneRepository from '../repository/phone';
import ReportRepository from '../repository/report';
import { CRUD } from '../common/interfaces/crud.interface';
import { PutReportDto } from '../dto/report/putReport';
import { PatchReportDto } from '../dto/report/patchReport';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class PhoneService implements CRUD {
    async create(resource: CreatePhoneDto) {
        try {
            return PhoneRepository.addPhone(resource);
        } catch (error) {
            throw error
        }
    }

    async deleteById(id: string) {
        return PhoneRepository.removePhoneById(id);
    }

    async list(queryParams: QueryParams) {
        return PhoneRepository.getPhones(queryParams);
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

    // async readByIMEI(imei: number) {
    //     return PhoneRepository.getReportById(id);
    // }

    async readPhoneReportByIMEI(imei: number) {
        return PhoneRepository.getPhoneReportByIMEI(imei);
    }
}

export default new PhoneService();
