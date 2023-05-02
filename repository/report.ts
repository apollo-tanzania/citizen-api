import debug from 'debug';
import ReportModel from '../model/report';
import { PatchReportDto } from '../dto/report/patchReport';
import { PutReportDto } from '../dto/report/putReport';
import { CreateReportDto } from '../dto/report/createReport';
import { ClientSession, FilterQuery, UpdateQuery } from 'mongoose';
import mongooseService from '../common/services/mongoose.service';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';
import ReportVerificationLogModel from '../model/reportVerificationLog';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';
import { PatchReportVerificationLogDto } from '../dto/reportVerificationLog/patchReportVerificationLog';
import { PutReportVerificationLogDto } from '../dto/reportVerificationLog/putReportVerificationLog';

const log: debug.IDebugger = debug('app:reports-dao');

class ReportRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;
    ReportVerificationLog = ReportVerificationLogModel;

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
            let query : FilterQuery<QueryType> = {}

            if (reportFields.phone.imei1) {
                query.imei1 = reportFields.phone.imei1
                reportQModelueryFilterArray.push({ "phone.imei1": query.imei1 })
                phoneModelQueryFilterArray.push({ "imei1": query.imei1 })
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
                    originalReportId: new (mongooseService.getMongoose().Types.ObjectId)(reportFound?._id),
                });
            }

            await report.save();

            console.log("1", reportQModelueryFilterArray)

            console.log("2", phoneModelQueryFilterArray)
            const existingPhone = await this.StolenPhone.findOne({
                $or: phoneModelQueryFilterArray,
            },
                null,
                { sort: { _id: -1 } }
            ).exec();

            console.log(JSON.stringify(reportFields?.phone))
            // return existingPhone;
            const update: UpdateQuery<{ countReportedStolenOrLost: number }> = { $inc: { countReportedStolenOrLost: 1 } }

            console.log(existingPhone)
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
            throw error;

        } finally {
            session.endSession();

        }
    }

    async removeReportById(reportId: string) {
        return this.Report.findByIdAndRemove({ _id: reportId }).exec();
    }

    async getReportById(reportId: string) {
        return this.Report.findOne({ _id: reportId }).exec();
    }

    async getReports(queryParams: QueryParams) {
        return queryWithPagination(this.Report, queryParams)
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

    async approveReport(
        reportId: string,
        approveReportFields: PatchReportVerificationLogDto | PutReportVerificationLogDto
    ) {
        const { startSession } = mongooseService.getMongoose();
        const session: ClientSession = await startSession();

        session.startTransaction(); // Start transaction

        try {
            const report = await this.getReportById(reportId)
            if (!report) {
                const error = new Error("Report is already disapproved");
                error.name = "MongoError";
                throw error;
            }

            if (report.verified === true) {
                const error = new Error("Report is already approved");
                error.name = "MongoError";
                throw error;
            }

            const updatedReport = await this.updateReportById(
                report._id,
                {
                    verified: true
                }
            )

            if (!updatedReport) {
                const error = new Error("Report not updated")
                error.name = "MongoError";
                throw error;
            }

            const reportVerificationLog = new this.ReportVerificationLog({
                reportId: updatedReport._id,
                newVerifiedStatus: updatedReport.verified,
                issuedBy: approveReportFields.authorizedBy
            })

            await reportVerificationLog.save();

            session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }


    }

    async disapproveReport(
        reportId: string,
        disapproveReportFields: PatchReportVerificationLogDto | PutReportVerificationLogDto
    ) {
        const { startSession } = mongooseService.getMongoose();
        const session: ClientSession = await startSession();

        session.startTransaction(); // Start transaction

        try {
            const report = await this.Report.findOne({ _id: reportId });
            if (!report) {
                const error = new Error(`Report not found`);
                error.name = "MongoError"
                throw error;
            }

            if (report.verified === false) {
                const error = new Error("Report is already disapproved");
                error.name = "MongoError"
                throw error;
            }

            // Returns report document with updated information, otherwise returns null
            const updatedReport = await this.updateReportById(
                report._id,
                {
                    verified: false
                }
            )

            if (!updatedReport) {
                const error = new Error("Report not updated")
                error.name = "MongoError"
                throw error;
            }

            const reportVerificationLog = new this.ReportVerificationLog({
                reportId: updatedReport._id,
                newVerifiedStatus: updatedReport.verified,
                reason: disapproveReportFields.reason,
                issuedBy: disapproveReportFields.authorizedBy
            })

            await reportVerificationLog.save();

            session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }


    }

    // async addReportVerificationLog(lawEnforcementOfficerVerificationHistoryFields: CreateLawEnforcementVerificationHistoryDto) {
    //     const session: ClientSession = await mongooseService.getMongoose().startSession();

    //     session.startTransaction(); // Start transaction

    //     try {

    //         const officerToBeVerified = await this.LawEnforcement.findOne({ username: lawEnforcementOfficerVerificationHistoryFields.lawEnforcementId });

    //         // return officerToBeVerified;
    //         if (officerToBeVerified?.isVerified) {
    //             return {
    //                 message: "Officer already verified",
    //                 type: "Conflict"
    //             }
    //         }

    //         // update status to verified
    //         await this.LawEnforcement.findOneAndUpdate(
    //             { username: officerToBeVerified?.username },
    //             {
    //                 $set: {
    //                     isVerified: true
    //                 }
    //             },
    //             { new: true }
    //         ).exec();

    //         const lawEnforcementOfficerVerificationHistory = await new this.LawEnforcementVerificationHistory({
    //             ...lawEnforcementOfficerVerificationHistoryFields
    //         })

    //         await lawEnforcementOfficerVerificationHistory.save();

    //         await session.commitTransaction();

    //         return lawEnforcementOfficerVerificationHistory;

    //     } catch (error) {
    //         // Rollback the transaction i.e rollback any changes made to the database
    //         await session.abortTransaction();
    //         // throw error;
    //         return error;

    //     } finally {
    //         // Ending sesion
    //         session.endSession()
    //     }

    // }
}

export default new ReportRepository();
