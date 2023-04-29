import LawEnforcementVerificationHistoryRepository from '../repository/lawEnforcementVerificationHistory';
import { CRUD } from '../common/interfaces/crud.interface';
import { PutLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/putLawEnforcementVerificationHistory';
import { PatchLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/patchLawEnforcementVerificationHistory';
import { CreateLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/createLawEnforcementVerificationHistory';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class LawEnforcementVerificationHistoryService implements CRUD {
    async create(resource: CreateLawEnforcementVerificationHistoryDto) {
        return LawEnforcementVerificationHistoryRepository.addLawEnforcementVerificationHistory(resource) ;
    }

    async deleteById(id: string) {
        return LawEnforcementVerificationHistoryRepository.removeLawEnforcementVerificationHistoryById(id);
    }

    async list(queryParams: QueryParams) {
        return LawEnforcementVerificationHistoryRepository.getLawEnforcementsVerificationHistory(queryParams);
    }

    async patchById(id: string, resource: PatchLawEnforcementVerificationHistoryDto): Promise<any> {
        return LawEnforcementVerificationHistoryRepository.updateLawEnforcementVerificationHistoryIdById(id, resource);
    }

    async putById(id: string, resource: PutLawEnforcementVerificationHistoryDto): Promise<any> {
        return LawEnforcementVerificationHistoryRepository.updateLawEnforcementVerificationHistoryIdById(id, resource);
    }

    async readById(id: string) {
        return LawEnforcementVerificationHistoryRepository.getLawEnforcementVerificationHistoryById(id);
    }

}

export default new LawEnforcementVerificationHistoryService();
