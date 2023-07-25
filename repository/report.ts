import debug from 'debug';
import ReportModel, { ILostPhoneReport } from '../model/report';
import { PatchReportDto } from '../dto/report/patchReport';
import { PutReportDto } from '../dto/report/putReport';
import { CreateReportDto } from '../dto/report/createReport';
import { ClientSession, Error, FilterQuery, Types, UpdateQuery } from 'mongoose';
import mongooseService from '../common/services/mongoose.service';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';
import ReportVerificationLogModel from '../model/reportVerificationLog';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';
import { PatchReportVerificationLogDto } from '../dto/reportVerificationLog/patchReportVerificationLog';
import { PutReportVerificationLogDto } from '../dto/reportVerificationLog/putReportVerificationLog';
import { compareObjects, deletePropsExcept, generateImei, isArrayContainsUniqueValues, validateIMEINumber } from '../common/helpers/utils';
import { CustomError } from '../errors/CustomError';
import { ConflictError } from '../errors/ConflictError';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import ImeiService from '../service/imei';
import { ReportStatus, customObject } from '../types';
import { UnprocessableEntityError } from '../errors/UnprocessableEntityError';
import { strings } from '../common/helpers/constants';

const log: debug.IDebugger = debug('app:reports-dao');

class ReportRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;
    ReportVerificationLog = ReportVerificationLogModel;
    imeiService = ImeiService;

    constructor() {
        log('Created new instance of Report Repository');
    }
    async saveReport(reportFields: CreateReportDto) {
        const { startSession } = mongooseService.getMongoose();
        const session: ClientSession = await startSession();
        session.startTransaction(); // Start transaction
        try {
            // session.startTransaction(); // Start transaction

            try {
                type QueryType = Record<any, Number>
                let reportPhoneImeis = reportFields.phone.imei;
                let phoneImeiSchemaList = this.createListOfPhoneImeiSchema(reportPhoneImeis)
                let referenceImei; // reference refers to the imei found to get stolen phone in the database

                // Check if the phone exists
                let existingPhone = null; // refers to the existing phone found by the reference imei from the user input
                let index = 0;
                for (let phone of phoneImeiSchemaList) {
                    existingPhone = await this.StolenPhone.findOne({
                        "imeis.imei": { $in: [phone.imei] },
                    },
                        null,
                        { sort: { _id: -1 } }
                    ).exec();

                    if (existingPhone) {
                        referenceImei = phone;
                        break;
                    };
                    index++
                }

                let reportFound = null;
                // Get latest report associated with the existing phone found in the database
                reportFound = await this.Report.findOne(
                    { stolenPhoneId: existingPhone?._id }
                )
                    .sort({ _id: -1 })
                    .exec();

                let imeiFoundDoc = null
                // query unique phone features and compare for similarity incase it has multiple IMEI slots
                try {
                    const imeiFound = await this.imeiService.search(reportPhoneImeis[0]); // search IMEI details from any IMEI given by the user from victim's report
                    imeiFoundDoc = imeiFound.toObject()
                } catch (error) {
                    throw error
                }


                // get IMEI slots count
                let slotsCount = imeiFoundDoc.deviceSpecification.simSlots;

                // NON-EXISTING IMEI AS STOLEN DEVICE TO THE DATABASE
                if (!existingPhone) {
                    try {
                        let newImeis: number[] = []

                        const phoneInformationToCompare = ["brand", "name", "model", "models", "tac", "deviceSpecification", "simSlots"]

                        // Phone being reported as stolen
                        const reportedPhoneImeis = reportPhoneImeis;

                        if (!isArrayContainsUniqueValues(reportedPhoneImeis)) throw new UnprocessableEntityError("Imeis of the same phone should be unique")

                        // Comparison starts here
                        for (let phoneImei of reportedPhoneImeis) {

                            if (phoneImei) {

                                try {
                                    // Get information of the device
                                    let slotImei = await this.imeiService.search(phoneImei);
                                    let slotImeiFoundDoc = slotImei.toObject()

                                    let areSimilar = compareObjects(imeiFoundDoc, slotImeiFoundDoc, phoneInformationToCompare)

                                    if (!areSimilar) throw new UnprocessableEntityError("IMEIs do not match to the same device")

                                    // Construct a complete IMEI
                                    let tac = slotImeiFoundDoc.tac
                                    let serial = slotImeiFoundDoc.serial
                                    let checkDigit = slotImeiFoundDoc.checkDigit

                                    // Concatenate imei building blocks
                                    let imei = generateImei(tac as number, serial as number, checkDigit as number)
                                    // End of IMEI string construction
                                    if (!imei) throw new UnprocessableEntityError("IMEI not generated") // If failed throw exception

                                    newImeis.push(imei)
                                } catch (error) {
                                    throw error;
                                }


                            }

                        }

                        // NON-EXISTING IMEI BUT MAYBE SAME PHONE INFORMATION TO THE EXISTING STORED IMEI(S)

                        let newStolenPhone = null
                        let similarPhone = null
                        // Get All Stolen Phones and compare properties with this phone before saving it
                        let currentListOfStolenPhones = await this.StolenPhone.find().exec()

                        // Compare properties with imei1 from each record with imei properties of the referenec IMEI
                        for (let stolenPhone of currentListOfStolenPhones) {
                            try {
                                let slotImei = await this.imeiService.search(stolenPhone["imeis"][0].imei); // any imei can be used, but recommended is imei1 because likely must have value
                                let slotImeiFoundDoc = slotImei.toObject()

                                let areSimilar = compareObjects(imeiFoundDoc, slotImeiFoundDoc, phoneInformationToCompare)

                                if (areSimilar) {
                                    similarPhone = stolenPhone;
                                    break;
                                }
                            } catch (error) {
                                throw error
                            }

                        }

                        if (similarPhone) { // If phone not found but there are similarity of the IMEIs

                            try {
                                // Compare for number of imeis between the existing stolen phone and the new reported phone from it's report
                                // Convert Doc to JS Object
                                let existingStolenPhone = similarPhone.toObject();
                                // let temp = similarPhone.toObject(); // To extract current imeis in the stolen phone doc

                                let currentStolenPhoneImeiCount = existingStolenPhone.imeis.length;

                                newImeis = newImeis.filter(imei => !existingStolenPhone.imeis.includes({ imei: imei.toString() }))

                                let currentLatestReportFOrThisPhone = null;
                                let newImeisDoc;

                                currentLatestReportFOrThisPhone = await this.Report.findOne(
                                    { stolenPhoneId: existingStolenPhone._id },
                                    null,
                                    { sort: { _id: -1 } }
                                ).exec()

                                newImeisDoc = this.createListOfPhoneImeiSchema(newImeis)
                                const update: UpdateQuery<{ countReportedStolenOrLost: number }> = { $inc: { countReportedStolenOrLost: 1 } }

                                let newReport = null;

                                // Do this if there is a saved report associated with the stolen phone
                                let reportFound = currentLatestReportFOrThisPhone

                                if (reportFound) {
                                    try {
                                        newReport = new this.Report({
                                            stolenPhoneId: existingStolenPhone?._id, // Existing phone record
                                            "phone.imeis": phoneImeiSchemaList,
                                            victim: reportFields.victim,
                                            incident: reportFields.incident,
                                            originalReportId: new (mongooseService.getMongoose().Types.ObjectId)(reportFound?._id), // Reference of the previous report since they share same phone information
                                        });

                                        // Prevent duplicate report
                                        const possibleDuplicateReport = await this.Report.findOne(
                                            {
                                                stolenPhoneId: existingStolenPhone._id,
                                                victim: reportFields.victim,
                                                "incident.date": reportFields.incident.date,
                                                status: ReportStatus.open
                                            }
                                        )

                                        if (possibleDuplicateReport) throw new UnprocessableEntityError(strings.ERROR_MESSAGES.DUPLICATE_REPORT)

                                    } catch (error) {
                                        throw error
                                    }
                                }

                                // save the report depending on the repective scenario taken
                                const savedReport = await newReport?.save();

                                if (!savedReport) throw new UnprocessableEntityError("Report not saved!!!!!!")
                                // Udate new IMEI to reported phone
                                let imeiUpdateQ = await this.StolenPhone.updateOne(
                                    { _id: existingStolenPhone._id },
                                    { imeis: [...existingStolenPhone.imeis, ...newImeisDoc] }
                                )

                                if (!imeiUpdateQ.acknowledged) throw new UnprocessableEntityError("Could not update one of the new IMEI")
                                // Update the number of times the phone is reported stolen
                                let reportCountIncrementQ = await this.StolenPhone.findOneAndUpdate(
                                    { _id: existingStolenPhone._id },
                                    update
                                );

                                await session.commitTransaction();
                                return savedReport;

                            } catch (error) {
                                await session.abortTransaction();
                                throw error;
                            }

                        }

                        // OTHERWISE, IF PHONE INFO NEVER EXISTS IN THE DATABASE
                        // 1. create a new stolen phone record
                        // 2. create a new stolen phone report record
                        try {
                            // Step 1
                            let phoneInfo = this.createListOfPhoneImeiSchema(newImeis)
                            // return phoneInfo;
                            newStolenPhone = new this.StolenPhone({
                                imeis: phoneInfo,
                                countReportedStolenOrLost: 1
                            });

                            // Save stolen phone into the database
                            const savedPhone = await newStolenPhone.save();
                            // End Step 1

                            // Step 2
                            let report;

                            report = new this.Report({
                                stolenPhoneId: savedPhone?._id, // new stolen phone record
                                "phone.imeis": phoneImeiSchemaList,
                                incident: reportFields.incident,
                                victim: reportFields.victim,
                                // ...reportFields, // new report properties
                            });

                            // save the report associated with the saved stolen phone
                            const savedReport = await report.save();
                            // End Step 2

                            await session.commitTransaction();
                            return savedReport;

                        } catch (error) {
                            await session.abortTransaction();
                            throw error;
                        }

                    } catch (error) {
                        // await session.abortTransaction();
                        throw error
                    }
                }

                // OTHERWISE, THE REPORT WITH SUCH PHONE ALREADY EXISTS

                // Check if similar phone report already exists, it should exist because the stolen phone exists already in the database
                if (!reportFound) throw new UnprocessableEntityError(`No any report exists associated with existing stolen.`);

                let newImeis: number[] = []

                const phoneInformationToCompare = [strings.BRAND, strings.NAME, strings.MODEL, strings.MODELS, strings.TAC, strings.DEVICE_SPECIFICATION, strings.SIM_SLOTS]

                if (!isArrayContainsUniqueValues(reportPhoneImeis)) throw new UnprocessableEntityError("Imeis of the same phone should be unique")

                // Comparison starts here
                for (let phoneImei of phoneImeiSchemaList) {
                    if (phoneImei) {
                        try {
                            // Get information of the device
                            let slotImei = await this.imeiService.search(phoneImei.imei);
                            let slotImeiFoundDoc = slotImei.toObject()

                            let areSimilar = compareObjects(imeiFoundDoc, slotImeiFoundDoc, phoneInformationToCompare)

                            // If IMEI do not match same phone information
                            if (!areSimilar) throw new UnprocessableEntityError("IMEIs do not match to the same device")

                            // Construct a complete IMEI
                            let tac = slotImeiFoundDoc.tac
                            let serial = slotImeiFoundDoc.serial
                            let checkDigit = slotImeiFoundDoc.checkDigit

                            // Concatenate imei building blocks
                            let imei = generateImei(tac as number, serial as number, checkDigit as number)
                            // End of IMEI string construction
                            if (!imei) throw new UnprocessableEntityError("Failed to generate IMEI") // If failed throw exception

                            // Add to the list 
                            if (phoneImei !== referenceImei || existingPhone.imeis.includes(phoneImei)) {
                                newImeis.push(imei)
                            }
                        } catch (error) {
                            throw error
                        }
                    }
                }

                // If it is the same IMEI reported again
                if (newImeis.length === 0) {
                    try {
                        const update: UpdateQuery<{ countReportedStolenOrLost: number }> = { $inc: { countReportedStolenOrLost: 1 } }

                        let newReport;

                        // Do this if there is a saved report associated with the stolen phone
                        if (reportFound) {

                            if (!isArrayContainsUniqueValues(reportPhoneImeis)) throw new UnprocessableEntityError("Imeis of the same phone should be unique")

                            // Create report object if is scenario 2
                            newReport = new this.Report({
                                stolenPhoneId: existingPhone?._id, // Existing phone record
                                "phone.imeis": phoneImeiSchemaList,
                                victim: reportFields.victim,
                                incident: reportFields.incident,
                                originalReportId: new (mongooseService.getMongoose().Types.ObjectId)(reportFound?._id), // Reference of the previous report since they share same phone information
                            });

                            // Prevent duplicate report
                            const possibleDuplicateReport = await this.Report.findOne(
                                {
                                    stolenPhoneId: existingPhone._id,
                                    victim: reportFields.victim,
                                    "incident.date": reportFields.incident.date,
                                    status: ReportStatus.open
                                }
                            )

                            if (possibleDuplicateReport) throw new UnprocessableEntityError(strings.ERROR_MESSAGES.DUPLICATE_REPORT)
                        }

                        // save the report depending on the repective scenario taken
                        const savedReport = await newReport?.save();

                        if (!savedReport) throw new UnprocessableEntityError("Report not saved!!")

                        // Update the number of times the phone is reported stolen
                        await this.StolenPhone.findOneAndUpdate(
                            { _id: existingPhone._id },
                            update
                        );

                        await session.commitTransaction();

                        return savedReport;
                    } catch (error) {
                        await session.abortTransaction();
                        throw error;
                    }
                }

                // Else, new IMEI(s) for the same phone are created
                const existingStolenPhone = existingPhone.toObject();

                // Get number of IMEIs present in the current stolen phone
                let currentStolenPhoneImeiCount = existingStolenPhone.imeis.length;

                // Create variable to load non-existing IMEIs from the current stolen phone
                let phoneImeiUpdates;

                phoneImeiUpdates = this.createListOfPhoneImeiSchema(newImeis)

                // Prepare the update query object
                const update: UpdateQuery<{ countReportedStolenOrLost: number }> = { $inc: { countReportedStolenOrLost: 1 } }

                // new report can either be in two scenarios
                // 1.both phone and report never existed before
                // 2.report of the same phone already exists, so create a new report one with reference of the previous report of the same phone
                let newReport;

                // Scenario no 2 here
                // Do this if there is a saved report associated with the stolen phone
                if (reportFound) {
                    try {
                        if (!isArrayContainsUniqueValues(reportPhoneImeis)) throw new UnprocessableEntityError("Imeis of the same phone should be unique")

                        // Create report object if is scenario 2
                        newReport = new this.Report({
                            stolenPhoneId: existingPhone?._id, // Existing phone record
                            "phone.imeis": phoneImeiSchemaList,
                            victim: reportFields.victim,
                            incident: reportFields.incident,
                            originalReportId: new (mongooseService.getMongoose().Types.ObjectId)(reportFound?._id), // Reference of the previous report since they share same phone information
                        });

                        // Prevent duplicate report
                        const possibleDuplicateReport = await this.Report.findOne(
                            {
                                stolenPhoneId: existingStolenPhone._id,
                                victim: reportFields.victim,
                                "incident.date": reportFields.incident.date,
                                status: "open"
                            }
                        )
                        if (possibleDuplicateReport) throw new UnprocessableEntityError(strings.ERROR_MESSAGES.DUPLICATE_REPORT)

                    } catch (error) {
                        throw error
                    }
                }

                // Check if similar phone report already exists, it should exist because the stolen phone exists already in the database
                // if (!reportFound) throw new UnprocessableEntityError(`No any report associated with ${existingPhone.toObject().imei1} not found`)

                // save the report depending on the repective scenario taken
                const savedReport = await newReport?.save();

                if (!savedReport) throw new UnprocessableEntityError("Report has not been saved")

                // Update the number phone with new imei(s) found
                await this.StolenPhone.updateOne(
                    { _id: existingStolenPhone._id },
                    { imeis: [...existingStolenPhone.imeis, ...phoneImeiUpdates] }
                )

                // Update the number of times the phone is reported stolen
                await this.StolenPhone.findOneAndUpdate(
                    { _id: existingStolenPhone._id },
                    update
                );

                await session.commitTransaction();

                return savedReport;

            } catch (error) {
                // await session.abortTransaction();
                throw error;
            }

        } catch (error) {
            // if(error instanceof Error) {
            //     await session.abortTransaction()
            //     throw error
            // }
            // await session.abortTransaction();
            log("Transaction aborted");
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

    // TODO
    // getNumberOfReports(phoneId){

    // }

    // getNumberOfVerifiedReports(phoneId){

    // }
    //

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
                const error = new ResourceNotFoundError();
                throw error;
            }

            if (report.verified === true) {
                const error = new ConflictError("Report is already approved");
                throw error;
            }

            const updatedReport = await this.updateReportById(
                report._id,
                {
                    verified: true
                }
            )

            if (!updatedReport) {
                const error = new CustomError("Mongoose Error", "Report not updated")
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
                const error = new ResourceNotFoundError("Report not found");
                throw error;
            }

            if (report.verified === false) {
                const error = new ConflictError("Report is already disapproved");
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
                const error = new CustomError("Mongoose Error", "Report not updated")
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

    private  createListOfPhoneImeiSchema(arr: string[] | number[], startIndex = 0) {
        try {
            let arrayOfImeis = []
            let index = startIndex
            for (let value of arr) {
                arrayOfImeis.push({
                    imei: value as string
                })
                index++;
            }
            return arrayOfImeis;
        } catch (error) {
            throw error
        }

    }

    // Patterns and Trends
    // 1. phone theft activity
    // private async phoneTheftActivity() {
    //     try {

    //         const stolenPhones = await this.StolenPhone.find().exec();

    //         let totalReports = 0
    //         let totalVerifiedReports = 0

    //         for (let i = 0; i < stolenPhones.length; i++) {
    //             let reportsFoundWithTheIMEI = await this.Report.find({
    //                 $or: [
    //                     { "phone.imei1": stolenPhones[i].imei1 },
    //                     { "phone.imei2": stolenPhones[i].imei1 },
    //                     { "phone.imei3": stolenPhones[i].imei1 },
    //                 ]
    //             }).exec()

    //             totalReports += stolenPhones[i].countReportedStolenOrLost
    //             totalVerifiedReports += reportsFoundWithTheIMEI.filter(report => report.verified === true).length
    //         }

    //         const verifiedRatio = totalReports > 0 ? totalVerifiedReports / totalReports : 0

    //         return {
    //             totalReports,
    //             totalVerifiedReports,
    //             verifiedRatio
    //         }

    //     } catch (error) {
    //         throw error
    //     }
    // }
}

export default new ReportRepository();
