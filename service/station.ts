import StationRepository from '../repository/station';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateStationDto } from '../dto/station/createStation';
import { PutStationDto } from '../dto/station/putStation';
import { PatchStationDto } from '../dto/station/patchStation';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class StationService implements CRUD {
    async create(resource: CreateStationDto) {
        try {
            return StationRepository.addStation(resource);
        } catch (error) {
            return error
        }
    }

    async deleteById(id: string) {
        return StationRepository.removeStationById(id);
    }

    async list(queryParams: QueryParams) {
        return StationRepository.getStations(queryParams);
    }

    async patchById(id: string, resource: PatchStationDto): Promise<any> {
        return StationRepository.updateStationById(id, resource);
    }

    async putById(id: string, resource: PutStationDto): Promise<any> {
        return StationRepository.updateStationById(id, resource);
    }

    async readById(id: string) {
        return StationRepository.getStationById(id);
    }
}

export default new StationService();
