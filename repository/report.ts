import debug from 'debug';
import ReportModel from '../model/report';
import { PatchReportDto } from '../dto/report/patchReport';
import { PutReportDto } from '../dto/report/putReport';
import { CreateReportDto } from '../dto/report/createReport';
import { ClientSession, UpdateQuery } from 'mongoose';
import mongooseService from '../common/services/mongoose.service';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';

const log: debug.IDebugger = debug('app:reports-dao');

class ReportRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;

    constructor() {
        log('Created new instance of Report Repository');
    }

    // async addReport(reportFields: CreateReportDto) {
    //     const { startSession } = mongooseService.getMongoose();
    //     const session: ClientSession = await startSession();

    //     session.startTransaction(); // Start transaction


    //     try {

    //         let queryFilterArray = []
    //         type QueryType = Record<any, Number>
    //         let query: QueryType = {}

    //         if (reportFields.phone.imei1) {
    //             query.imei1 = reportFields.phone.imei1
    //             queryFilterArray.push({ "phone.imei1": query.imei1 })
    //         }
    //         if (reportFields.phone.imei2) {
    //             query.imei2 = reportFields.phone.imei2
    //             queryFilterArray.push({ "phone.imei2": query.imei2 })
    //         }

    //         if (reportFields.phone.imei3) {
    //             query.imei3 = reportFields.phone.imei3
    //             queryFilterArray.push({ "phone.imei3": query.imei3 })
    //         }

    //         // returns null if not found
    //         const reportFound = await this.Report.findOne({
    //             $or: queryFilterArray,
    //         },
    //             null,
    //             { sort: { _id: -1 } }
    //         ).exec();

    //         let report;

    //         report = new this.Report({
    //             ...reportFields,
    //         });

    //         if (reportFound?._id) {
    //             report = new this.Report({
    //                 ...reportFields,
    //                 originalReportId: mongooseService.getMongoose().Types.ObjectId(reportFound?._id),
    //             });
    //         }

    //         await report.save();

    //         const stolenPhone = new this.StolenPhone({
    //             ...reportFields?.phone
    //         })

    //         await stolenPhone.save();

    //         await session.commitTransaction();

    //         return report;

    //     } catch (error) {

    //         await session.abortTransaction();
    //         return error;

    //     } finally {
    //         session.endSession();

    //     }
    //     // await report.save();
    //     // return reportId;
    // }
    async addReport(reportFields: CreateReportDto) {
        const { startSession } = mongooseService.getMongoose();
        const session: ClientSession = await startSession();

        session.startTransaction(); // Start transaction


        try {

            let reportQModelueryFilterArray = []
            let phoneModelQueryFilterArray = []
            type QueryType = Record<any, Number>
            let query: QueryType = {}

            if (reportFields.phone.imei1) {
                query.imei1 = reportFields.phone.imei1
                reportQModelueryFilterArray.push({ "phone.imei1": query.imei1 })
                phoneModelQueryFilterArray.push({ "imei1": query.imei2 })
            }
            if (reportFields.phone.imei2) {
                query.imei2 = reportFields.phone.imei2
                reportQModelueryFilterArray.push({ "phone.imei2": query.imei2 })
                phoneModelQueryFilterArray.push({ "imei2": query.imei2 })
            }

            if (reportFields.phone.imei3) {
                query.imei3 = reportFields.phone.imei3
                reportQModelueryFilterArray.push({ "phone.imei3": query.imei3 })
                phoneModelQueryFilterArray.push({ "imei3": query.imei3 })
            }

            // returns null if not found
            const reportFound = await this.Report.findOne({
                $or: reportQModelueryFilterArray,
            },
                null,
                { sort: { _id: -1 } }
            ).exec();

            let report;

            report = new this.Report({
                ...reportFields,
            });

            if (reportFound?._id) {
                report = new this.Report({
                    ...reportFields,
                    originalReportId: mongooseService.getMongoose().Types.ObjectId(reportFound?._id),
                });
            }

            await report.save();

            const existingPhone = await this.StolenPhone.findOne({
                $or: phoneModelQueryFilterArray,
            },
                null,
                { sort: { _id: -1 } }
            ).exec();

            const update: UpdateQuery<{ countReportedStolenOrLost: number }> = { $inc: { countReportedStolenOrLost: 1 } }

            if (existingPhone) {
                await this.StolenPhone.findOneAndUpdate({
                    $or: phoneModelQueryFilterArray
                }, update)

            } else {
                const stolenPhone = new this.StolenPhone({
                    ...reportFields?.phone,
                    countReportedStolenOrLost: 1
                })

                await stolenPhone.save();

            }


            await session.commitTransaction();

            return report;

        } catch (error) {

            await session.abortTransaction();
            return error;

        } finally {
            session.endSession();

        }
    }

    async removeReportById(reportId: string) {
        return this.Report.deleteOne({ _id: reportId }).exec();
    }

    async getReportById(reportId: string) {
        return this.Report.findOne({ _id: reportId }).populate('Report').exec();
    }

    async getReports(limit = 10, page = 0) {
        return this.Report.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateReportById(
        reportId: string,
        reportFields: PatchReportDto | PutReportDto
    ) {
        const existingReport = await this.Report.findOneAndUpdate(
            { _id: reportId },
            { $set: reportFields },
            { new: true }
        ).exec();

        return existingReport;
    }
}

export default new ReportRepository();
