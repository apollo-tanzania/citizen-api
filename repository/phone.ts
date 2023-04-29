import shortid from 'shortid';
import debug from 'debug';
import ReportModel from '../model/report';
import { PatchPhoneDto } from '../dto/phone/patchPhone';
import { PutPhoneDto } from '../dto/phone/putPhone';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';

const log: debug.IDebugger = debug('app:phones-dao');

class PhoneRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;

    constructor() {
        log('Created new instance of Phone Repository');
    }

    async addPhone(phoneFields: CreatePhoneDto) {

        try {
            const stolenPhone = new this.StolenPhone({
                ...phoneFields,
            });

            await stolenPhone.save();

            return stolenPhone?._id;

        } catch (error) {

            return error;

        }
    }

    async removePhoneById(phoneId: string) {
        return this.StolenPhone.deleteOne({ _id: phoneId }).exec();
    }

    async getPhoneById(phoneId: string) {
        return this.StolenPhone.findOne({ _id: phoneId }).populate('Phone').exec();
    }

    async getPhones(queryParams: QueryParams) {
        return queryWithPagination(this.StolenPhone, queryParams)
    }

    async updatePhoneById(
        phoneId: string,
        phoneFields: PatchPhoneDto | PutPhoneDto
    ) {
        const existingPhone = await this.StolenPhone.findOneAndUpdate(
            { _id: phoneId },
            { $set: phoneFields },
            { new: true }
        ).exec();

        return existingPhone;
    }
}

export default new PhoneRepository();
