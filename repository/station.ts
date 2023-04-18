import shortid from 'shortid';
import debug from 'debug';
import StationModel from '../model/station';
import { PatchReportDto } from '../dto/report/patchReport';
import { PutReportDto } from '../dto/report/putReport';
import { CreateReportDto } from '../dto/report/createReport';
import { PatchStationDto } from '../dto/station/patchStation';
import { PutStationDto } from '../dto/station/putStation';
import { CreateStationDto } from '../dto/station/createStation';

const log: debug.IDebugger = debug('app:reports-dao');

class StationRepository {

    Station = StationModel;

    constructor() {
        log('Created new instance of Report Repository');
    }

    async addStation(stationFields: CreateStationDto) {
        const station = new this.Station({
            ...stationFields,
        });
        try {
            await station.save();
            return station;
        } catch (error) {
            // throw new Error("Could not add report");
            return error

        }
     
    }

    async removeStationById(stationId: string) {
        return this.Station.deleteOne({ _id: stationId }).exec();
    }

    async getStationById(stationId: string) {
        return this.Station.findOne({ _id: stationId }).populate('Station').exec();
    }

    async getStations(limit = 10, page = 0) {
        return this.Station.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateStationById(
        stationId: string,
        stationFields: PatchStationDto | PutStationDto
    ) {
        const existingStation = await this.Station.findOneAndUpdate(
            { _id: stationId },
            { $set: stationFields },
            { new: true }
        ).exec();

        return existingStation;
    }
}

export default new StationRepository();
