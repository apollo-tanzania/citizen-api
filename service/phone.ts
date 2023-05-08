import PhoneRepository from '../repository/phone';
import { CRUD } from '../common/interfaces/crud.interface';
import { PatchPhoneDto } from '../dto/phone/patchPhone';
import { PutPhoneDto } from '../dto/phone/putPhone';
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

    async patchById(id: string, resource: PatchPhoneDto): Promise<any> {
        return PhoneRepository.updatePhoneById(id, resource);
    }

    async putById(id: string, resource: PutPhoneDto): Promise<any> {
        return PhoneRepository.updatePhoneById(id, resource);
    }

    async readById(id: string) {
        return PhoneRepository.getPhoneById(id);
    }

    async readPhoneReportByIMEI(imei: number) {
        return PhoneRepository.getPhoneReportByIMEI(imei);
    }
}

export default new PhoneService();
