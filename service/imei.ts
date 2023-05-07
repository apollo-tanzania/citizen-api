import ImeiRepository from '../repository/imei';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateImeiDto } from '../dto/imei/createImei';
import { PatchImeiDto } from '../dto/imei/patchImei';
import { PutImeiDto } from '../dto/imei/putImei';
import { QueryParams } from '../repository/utils/createPaginatedQuery';


class ImeiService implements CRUD {
    async create(resource: CreateImeiDto) {
        return ImeiRepository.addIMEI(resource);
    }

    async deleteById(id: string) {
        return ImeiRepository.removeIMEIById(id);
    }

    async list(queryParams: QueryParams) {
        return ImeiRepository.getImeis(queryParams);
    }

    async patchById(id: string, resource: PatchImeiDto): Promise<any> {
        return ImeiRepository.updateImeiById(id, resource);
    }

    async putById(id: string, resource: PutImeiDto): Promise<any> {
        return ImeiRepository.updateImeiById(id, resource);
    }

    async readById(id: string) {
        return ImeiRepository.getIMEIById(id);
    }

    async search(ImeiNumber: string) {
        return ImeiRepository.search(ImeiNumber);
    }
}

export default new ImeiService();
