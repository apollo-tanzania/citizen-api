import LawEnforcementRepository from '../repository/lawEnforcement';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateLawEnforcementDto } from '../dto/lawEnforcement/createLawEnforcement';
import { PutLawEnforcementDto } from '../dto/lawEnforcement/putLawEnforcement';
import { PatchLawEnforcementDto } from '../dto/lawEnforcement/patchLawEnforcement';
import { CreateLawEnforcementVerificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/createLawEnforcementVerificationHistory';
import { CreateLawEnforcementUnverificationHistoryDto } from '../dto/lawEnforcementVerificationHistory/createLawEnforcementUnverificationHistory';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class LawEnforcementService implements CRUD {
    async create(resource: CreateLawEnforcementDto) {
        return LawEnforcementRepository.addLawEnforcement(resource) ;
    }

    async deleteById(id: string) {
        return LawEnforcementRepository.removeLawEnforcementById(id);
    }

    async list(queryParams: QueryParams) {
        return LawEnforcementRepository.getLawEnforcements(queryParams);
    }

    async patchById(id: string, resource: PatchLawEnforcementDto): Promise<any> {
        return LawEnforcementRepository.updateLawEnforcementIdById(id, resource);
    }

    async putById(id: string, resource: PutLawEnforcementDto): Promise<any> {
        return LawEnforcementRepository.updateLawEnforcementIdById(id, resource);
    }

    async readById(id: string) {
        return LawEnforcementRepository.getLawEnforcementById(id);
    }

    async getLawEnforcementByEmail(email: string) {
        return LawEnforcementRepository.getLawEnforcementByEmail(email);
    }

    async updateLawEnforcementVerificationStatus(resource: CreateLawEnforcementVerificationHistoryDto) {
        return LawEnforcementRepository.updateLawEnforcementVerificationStatus(resource);
    }

    async revokeLawEnforcementVerificationStatus(resource: CreateLawEnforcementUnverificationHistoryDto) {
        return LawEnforcementRepository.revokeVerificationStatus(resource);
    }
}

export default new LawEnforcementService();
