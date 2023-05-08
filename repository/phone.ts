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
import { strings } from '../common/helpers/constants';


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

    async getPhoneReportByIMEI(imei: number) {
        const { startSession } = mongooseService.getMongoose();
        const session: ClientSession = await startSession();

        session.startTransaction(); // Start transaction
        try {

            const phone = await this.StolenPhone.findOne({
                $or: [
                    { imei1: imei },
                    { imei2: imei },
                    { imei3: imei }
                ]
            }).exec()

            if (!phone) {
                const imeiInfo = (await imeiRepository.search(imei.toString())).toObject()

                return {
                    reportedStolen: false,
                    remarks: "Phone not reported stolen or lost in our database",
                    phone: {
                        ...imeiInfo,
                        model: imeiInfo._model
                    }
                }
                // const phoneNotFoundError = new CustomError(undefined, "Phone not reported stolen or lost in our database", 404);
                // throw phoneNotFoundError;
            }

            const reportsFoundWithTheIMEI = await this.Report.find({
                $or: [
                    { "phone.imei1": phone.imei1 },
                    { "phone.imei2": phone.imei1 },
                    { "phone.imei3": phone.imei1 },
                ]
            }).exec()

            const imeiDoc = await imeiRepository.search(imei.toString());

            const imeiInfo = imeiDoc.toObject()

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

                    remark = `This phone has been reported stolen. ${numReports} ${reportWord}, ${numVerifiedReports} of which ${verbWord} ${verifiedReportWord}`
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
            await session.abortTransaction()
            throw error
        } finally {
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
