import PhoneRepository from '../repository/phone';
import PermissionLogRepository from '../repository/permissionLog';
import ReportRepository from '../repository/report';
import { CRUD } from '../common/interfaces/crud.interface';
import { PutReportDto } from '../dto/report/putReport';
import { PatchReportDto } from '../dto/report/patchReport';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class PermissionLogService implements CRUD {
    async create(resource: CreatePhoneDto) {
        try {
            return PermissionLogRepository.addPermissionLog(resource);
        } catch (error) {
            throw error
        }
    }

    async deleteById(id: string) {
        return PermissionLogRepository.removePermissionLogById(id);
    }

    async list(queryParams: QueryParams) {
        return PermissionLogRepository.getPermissionLogs(queryParams);
    }

    async patchById(id: string, resource: any): Promise<any> {
        return PermissionLogRepository.updatePermissionById(id, resource);
    }

    async putById(id: string, resource: any): Promise<any> {
        return PermissionLogRepository.updatePermissionById(id, resource);
    }

    async readById(id: string) {
        return PermissionLogRepository.getPermissionLogById(id);
    }
}

export default new PermissionLogService();
