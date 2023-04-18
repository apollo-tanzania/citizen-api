import StationRepository from '../repository/station';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateStationDto } from '../dto/station/createStation';
import { PutStationDto } from '../dto/station/putStation';
import { PatchStationDto } from '../dto/station/patchStation';

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

    async list(limit: number, page: number) {
        return StationRepository.getStations(limit, page);
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
