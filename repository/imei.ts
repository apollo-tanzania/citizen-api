import debug from 'debug';
import { CreateImeiDto } from '../dto/imei/createImei';
import { generateImeiId, isObjectEmpty, paddedNumber, validateIMEINumber } from '../common/helpers/utils';
import { PatchImeiDto } from '../dto/imei/patchImei';
import { PutImeiDto } from '../dto/imei/putImei';
import ImeiModel from '../model/imei';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';
import https from 'https';
import { queryIMEI } from '../dummydata/mock.api';
import { BadGateWayError } from '../errors/BadGateWayError';
import { BadRequestError } from '../errors/BadRequestError';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import { InternalServerError } from '../errors/InternalServerError';
import { ImeiDBApiSuccessResponse } from '../types';
import { Types } from 'mongoose';
import { UnprocessableEntityError } from '../errors/UnprocessableEntityError';

const log: debug.IDebugger = debug('app:imei-dao');

class ImeiRepository {

    Imei = ImeiModel;

    constructor() {
        log('Created new instance of IMEI Repository');
    }

    async addIMEI(imeiFields: CreateImeiDto) {
        try {
            const IMEI = generateImeiId(imeiFields?.tac, imeiFields.serial, imeiFields.checkDigit)
            if (!IMEI) throw new Error(`Invalid IMEI`)
            const imei = new this.Imei({
                number: IMEI,
                ...imeiFields,
                _model: imeiFields.modelName
            });
            await imei.save();
            return IMEI;
        } catch (error) {
            throw error
        }

    }

    async removeIMEIById(imeiId: string) {
        return this.Imei.deleteOne({ _id: Types.ObjectId(imeiId) }).exec();
    }

    async getIMEIById(imeiId: string) {
        try {
            return this.Imei.findOne({ _id: Types.ObjectId(imeiId) }).exec();
        } catch (error) {
            throw error;
        }
    }

    async getDeviceByImei(imeiId: string) {
        return this.Imei.findOne({ number: imeiId }).exec();
    }

    async search(imeiNumber: string) {
        try {
            const isValid = validateIMEINumber(imeiNumber);


            if (!isValid) throw new UnprocessableEntityError(`${imeiNumber} is not a valid IMEI`);

            const device = await this.Imei.findOne({ number: imeiNumber }).exec();

            if (device) return device;

            // Fetch the device information from remote/ Third Party API
            const imeiDbReponse = await this.remoteIMEIRequest(imeiNumber)

            // Local mocking remote database
            // const imeiDbReponse = this.findIMEI("352933100520744")


            const imeiInfo = imeiDbReponse?.data

            if (isObjectEmpty(imeiInfo)) throw new ResourceNotFoundError(`Could not find Imei device`, 404);
            const imei = new this.Imei({
                number: imeiNumber,
                tac: paddedNumber(imeiInfo.tac, 8),
                serial: paddedNumber(imeiInfo.serial, 6),
                checkDigit: paddedNumber(imeiInfo.controlNumber, 1),
                valid: imeiInfo.valid,
                deviceId: imeiInfo.device_id,
                deviceImageUrl: imeiInfo.device_image,
                "deviceSpecification.simSlots": imeiInfo.device_spec.sim_slots as unknown as number,
                "deviceSpecification.operatingSystem": imeiInfo.device_spec.os,
                "deviceSpecification.operatingSystemFamily": imeiInfo.device_spec.os_family,
                "deviceSpecification.aliases": imeiInfo.device_spec.aliases,
                "deviceSpecification.wlan": imeiInfo.device_spec.wlan,
                "deviceSpecification.bluetooth": imeiInfo.device_spec.bluetooth,
                "deviceSpecification.nfc": imeiInfo.device_spec.nfc,
                "deviceSpecification.usb": imeiInfo.device_spec.usb,
                "deviceSpecification.speed": imeiInfo.device_spec.speed,
                "deviceSpecification.nettec": imeiInfo.device_spec.nettech,
                brand: imeiInfo.brand,
                name: imeiInfo.name,
                _model: imeiInfo.model,
                models: imeiInfo.models,
                manufacturer: imeiInfo.manufacturer,
                frequency: imeiInfo.frequency,
                blackListStatus: imeiInfo.blacklist.status
            });
            const savedIMEI = await imei.save();
            return savedIMEI;

        } catch (error) {
            throw error;
        }

    }

    async getImeis(queryParams: QueryParams) {
        return queryWithPagination(this.Imei, queryParams)
    }

    async updateImeiById(
        imeiId: string,
        imeiFields: PatchImeiDto | PutImeiDto
    ) {
        const existingImei = await this.Imei.findOneAndUpdate(
            { _id: imeiId },
            { $set: imeiFields },
            { new: true }
        ).exec();

        return existingImei?._id;
    }

    private findIMEI(imei: string) {
        let temp = parseInt(imei)
        return queryIMEI(temp) ? queryIMEI(temp) : undefined
    }

    private remoteIMEIRequest(imeiNumber: string) {

        // let responseData: any;
        return new Promise<ImeiDBApiSuccessResponse>((resolve, reject) => {
            let token = process.env.IMEI_DB_TOKEN as string;
            const req = https.get(`https://imeidb.xyz/api/imei/${imeiNumber}?token=${token}&format=json`,
                response => {
                    let data = "";

                    try {
                        response.on('data', chunk => {
                            data += chunk;
                        });

                        response.on('end', () => {
                            try {

                                let responseBody;
                                responseBody = JSON.parse(data);

                                // check if the response status as per imeidb api documentation
                                if (!responseBody.success) {
                                    let responseData;
                                    // Invalid data or numbers does not exist in the database
                                    if (responseBody.code === 401) {
                                        responseData = responseBody;
                                        reject(new ResourceNotFoundError(responseBody.message, 404));
                                    }
                                    // Out of balance
                                    if (responseBody.code === 402) {
                                        responseData = responseBody;
                                        reject(new BadGateWayError(responseBody.message, 502));
                                    }
                                    // Rate limit exceeded
                                    if (responseBody.code === 429) {
                                        responseData = responseBody;
                                        reject(new BadGateWayError(responseBody.message, 502));
                                    }
                                    // Invalid IMEI
                                    if (responseBody.code === 460) {
                                        responseData = responseBody;
                                        reject(new BadRequestError(responseData.message, 400));
                                    }
                                    // reject(responseData);
                                    reject(new BadGateWayError(responseBody.message, 502));
                                }

                                resolve(responseBody)

                            } catch (error) {
                                reject(new BadGateWayError(undefined, 502));

                            }

                        })

                        response.on('error', (error) => {
                            reject(new BadGateWayError(error.message, 502))

                        })
                    } catch (error) {
                        reject(new InternalServerError("Server Error", 500))

                    }

                })

            req.on('error', (error) => {
                reject(new BadGateWayError(error.message, 502))
            });

            req.end();

        })
    }
}

export default new ImeiRepository();
