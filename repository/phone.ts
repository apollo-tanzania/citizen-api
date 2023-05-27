import debug from 'debug';
import ReportModel from '../model/report';
import { PatchPhoneDto } from '../dto/phone/patchPhone';
import { PutPhoneDto } from '../dto/phone/putPhone';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';
import { ClientSession, Types } from 'mongoose';
import mongooseService from '../common/services/mongoose.service';
import { CustomError } from '../errors/CustomError';
import imeiRepository from './imei'
import ImeiService from '../service/imei';
import { strings } from '../common/helpers/constants';
import { compareObjects } from '../common/helpers/utils';


const log: debug.IDebugger = debug('app:phones-dao');

class PhoneRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;
    imeiService = ImeiService;

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

    async getPhoneReportByIMEI(imei: number) {
        const { startSession } = mongooseService.getMongoose();
        const session: ClientSession = await startSession();
        try {
            session.startTransaction(); // Start transaction
            try {
                let phone = null
                // phone = await this.StolenPhone.findOne({ "imeis.imei": { $elemMatch: { $eq: String(imei) } } }).exec()
                phone = await this.StolenPhone.findOne({
                    "imeis.imei": { $in: [imei.toString()] }
                })
                    .sort({ _id: -1 })
                    .exec()


                if (!phone) {
                    try {
                        const imeiInfo = (await imeiRepository.search(imei.toString())).toObject()

                        // check if the device info matches any of the available reported stolen in our database

                        let currentListOfStolenPhones = await this.StolenPhone.find().exec()
                        let similarPhone = null;
                        let referenceIMEI = null;
                        const phoneInformationToCompare = ["brand", "name", "model", "models", "tac", "deviceSpecification", "simSlots"]

                        // Compare properties with imei1 from each record with imei properties of the referenec IMEI
                        for (let stolenPhone of currentListOfStolenPhones) {
                            try {
                                referenceIMEI = stolenPhone["imeis"][0].imei
                                let slotImei = await this.imeiService.search(referenceIMEI); // any imei can be used, but recommended is imei1 because likely must have value
                                let slotImeiFoundDoc = slotImei.toObject()

                                let areSimilar = compareObjects(imeiInfo, slotImeiFoundDoc, phoneInformationToCompare)

                                if (areSimilar) {
                                    similarPhone = stolenPhone;
                                    break;
                                }
                            } catch (error) {
                                throw error
                            }
                        }
                        if (similarPhone) {

                            return {
                                reportedStolen: false,
                                remarks: `IMEI: ${imei} is yet reported stolen or lost in our database but there is a similar reported phone in our database with IMEI: ${referenceIMEI}. It might be a virtual IMEI or a device has multiple IMEIs. Check stolen report details using IMEI: ${referenceIMEI}`,
                                phone: {
                                    ...imeiInfo,
                                    model: imeiInfo._model
                                }
                            }
                        }
                        return {
                            reportedStolen: false,
                            remark: "Phone not reported stolen or lost in our database",
                            phone: {
                                ...imeiInfo,
                                model: imeiInfo._model
                            }
                        }
                    } catch (error) {
                        throw error
                    }

                }

                const reportsFoundWithTheIMEI = await this.Report.find({
                    stolenPhoneId: phone._id
                })
                    .sort({ _id: -1 })
                    .exec()

                const imeiDoc = await imeiRepository.search(imei.toString());

                const imeiInfo = imeiDoc.toObject();

                await session.commitTransaction()

                let numberOfStolenReportsForThisPhone = phone.countReportedStolenOrLost
                let numberOfVerifiedStolenReports = reportsFoundWithTheIMEI.filter(report => report.verified === true).length;

                let verifiedRatio = numberOfVerifiedStolenReports / numberOfStolenReportsForThisPhone

                function generateRemarkPhrase(numReports: number, numVerifiedReports: number) {
                    let remark = ''
                    const { PHRASE1, PHRASE2, PHRASE3, PHRASE4 } = strings.REPORT_REMARK_PHRASE
                    if (numReports === 0) {
                        remark = PHRASE1
                    }
                    else if (numReports === 1) {
                        remark = PHRASE2
                    }
                    else {
                        // if (verifiedRatio === 1) {
                        //     remark = `This phone is reported stolen and the report the associated report(s) are verified and legit.`
                        // } else if (verifiedRatio === 0.5) {
                        //     remark = PHRASE3
                        // } else if (verifiedRatio > 0.8) {
                        //     remark = PHRASE3
                        // } else if (verifiedRatio < 0.5) {
                        //     remark = PHRASE3
                        // }
                        const reportWord = (numReports > 1) ? 'reports' : 'report'
                        const verifiedReportWord = numVerifiedReports === 1 ? 'verified report' : 'verified reports'
                        const verbWord = numVerifiedReports === 1 ? 'is' : 'are'

                        remark = `This phone has been reported stolen. ${numReports} ${reportWord}, ${numVerifiedReports ? numVerifiedReports : "none"} of which ${verbWord} ${verifiedReportWord}`
                    }
                    return remark;
                }

                let remarkPhrase = generateRemarkPhrase(numberOfStolenReportsForThisPhone, numberOfVerifiedStolenReports)
                return {
                    reportedStolen: true,
                    numberOfStolenReportsForThisPhone: phone.countReportedStolenOrLost,
                    numberOfVerifiedStolenReportsForThisPhone: numberOfVerifiedStolenReports,
                    remark: remarkPhrase,
                    verifiedReportRatio: verifiedRatio,
                    phone: {
                        ...imeiInfo,
                        model: imeiInfo._model
                    },
                    reports: reportsFoundWithTheIMEI
                }

            } catch (error) {
                // console.log(error)
                // await session.abortTransaction()
                throw error
            }
        } catch (error) {
            log(error)
            await session.abortTransaction()
            throw error
        }
        finally {
            session.endSession()
        }

    }

    async getPhones(queryParams: QueryParams) {
        return queryWithPagination(this.StolenPhone, queryParams)
    }

    async getPhonesByDefaultQuery() {
        return this.StolenPhone.find().exec();
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

    private async getVerifiedReportsCount(stolenPhoneId: string) {
        const queryResult = await this.StolenPhone.aggregate([
            // Watch by id
            { $match: { _id: Types.ObjectId(stolenPhoneId) } },
            { $unwind: '$reports' },
            { $match: { 'reports.verified': true } },
            { $group: { _id: '$_id', verifiedReportsCount: { $sum: 1 } } }
        ])

        return queryResult.length ? queryResult[0].verifiedReportsCount : 0
    }
}

export default new PhoneRepository();
