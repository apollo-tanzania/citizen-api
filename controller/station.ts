import express from 'express';
import stationsService from '../service/station';
import debug from 'debug';

const log: debug.IDebugger = debug('app:stations-controller');

class StationsController {
   
    async listStations(req: express.Request, res: express.Response) {
        const stations = await stationsService.list(100, 0);
        res.status(200).send(stations);
    }

    async getStationById(req: express.Request, res: express.Response) {
        const user = await stationsService.readById(req.body.id);
        res.status(200).send(user);
    }

    async createStation(req: express.Request, res: express.Response) {
        const stationResponse = await stationsService.create(req.body);
        if(!stationResponse.ok){
            return res.status(201).send({ stationResponse });
        }
        return res.status(400).send({ stationResponse });
    }

    async patch(req: express.Request, res: express.Response) {
    
        log(await stationsService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await stationsService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeStation(req: express.Request, res: express.Response) {
        log(await stationsService.deleteById(req.body.id));
        res.status(204).send();
    }

}

export default new StationsController();
