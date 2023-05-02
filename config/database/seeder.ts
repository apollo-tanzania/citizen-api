import StationModel from "../../model/station";
import UserModel from "../../model/user";
import argon2 from 'argon2';
import AdminModel from "../../model/admin";
import shortid from "shortid";
import mongooseService from "../../common/services/mongoose.service";
import StolenPhoneModel from "../../model/stolenPhone";
import PermissionModel from "../../model/permission";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";
import Long from 'long'
import checkIfIs32bitInteger from "../../common/helpers/checkIfIs32bitIntenger";
import PermissionLogModel from "../../model/permissionLog";
import LostPhoneReportModel from "../../model/report";
import ReportVerifcaitonLogModel from "../../model/reportVerificationLog";
import { AnyArray } from "mongoose";
// initialize models variables
const Station = StationModel;
const User = UserModel;
const Admin = AdminModel;
const Permission = PermissionModel;
const StolenPhone = StolenPhoneModel;
const PermissionLog = PermissionLogModel;
const Report = LostPhoneReportModel;


const dataSeeder = async () => {

    // User.db.dropCollection("users")
    // Station.db.dropCollection("stations")
    // StolenPhoneModel.db.dropDatabase();
    // Permission.db.dropCollection("permissions")
    // console.log(Permission.db.collections)
    // StolenPhone.db.dropCollection("stolenphones")
    // Report.db.dropCollection("reports")

    // return


    //   console.log(await PermissionLogModel.find())
    // console.log(await ReportVerifcaitonLogModel.find())




    Station.countDocuments((err: Error, count: number) => {
        if (!err && count === 0) {
            new Station({
                _id: "RB-TBT",
                name: "Tabata",
                location: "Tabata"
            })
                .save()
                .then((station: any) => console.log(`${station?.name} is created`))
                .catch((err: any) => console.error(err))

            new Station({
                _id: "RB-MBZ",
                name: "Mbezi",
                location: "Mbezi"
            })
                .save()
                .then((station: any) => console.log(`${station?.name} is created`))
                .catch((err: any) => console.error(err))


            new Station({
                _id: "RB-KMR",
                name: "Kimara",
                location: "Kimara"
            })
                .save()
                .then((station: any) => console.log(`${station?.name} is created`))
                .catch((err: any) => console.error(err))

            new Station({
                _id: "RB-CHA",
                name: "Chamazi",
                location: "Chamazi"
            })
                .save()
                .then((station: any) => console.log(`${station?.name} is created`))
                .catch((err: any) => console.error(err))

        }
    })


    Permission.countDocuments(async (err: Error, count: number) => {
        const { startSession } = mongooseService.getMongoose()
        const session = await startSession();

        session.startTransaction();
        try {
            if (!err && count === 0) {

                let permissionsList = []

                for (const key in PermissionFlag) {
                    if (Object.hasOwnProperty.call(PermissionFlag, key)) {
                        if (!parseInt(key)) {
                            permissionsList.push({
                                name: key,
                                genericName: key?.replaceAll("_", " "),
                                flag: Long.fromNumber(PermissionFlag[key] as unknown as number),
                            })
                        }
                    }
                }

                permissionsList.map((permission) => {
                    new Permission({
                        name: permission.name,
                        genericName: permission.genericName,
                        flag: permission.flag
                    })
                        .save()
                        .then((permission: any) => console.log(`${permission?.name} is created`))
                        .catch((err: any) => console.error(err))
                })

                await session.commitTransaction();

            }
        } catch (error) {
            console.log("Error: " + error)
            await session.abortTransaction();

        } finally {
            session.endSession()
        }
    })

    User.countDocuments( async (err: Error, count: number) => {
        const { startSession } = mongooseService.getMongoose()
        const session = await startSession();

        session.startTransaction();
        try {
            if (!err && count === 0) {
                const hashedPassword = await argon2.hash("admin");

                await new User({
                    _id: shortid.generate(),
                    firstName: "Christopher",
                    middleName: "Fredrick",
                    lastName: "Masaka",
                    role: "admin",
                    email: "admin@citizen.com",
                    password: hashedPassword,
                    confirmed: true
                })
                    .save()
                    .then((user: any) => {
                        new Admin({
                            username: user?._id,
                            permissionFlags: 8589934592
                            // 8589965312 {create report, view reports}
                        })
                            .save()
                            .then((admin: any) => console.log(`Admin is created`))
                            .catch((err: any) => console.log(err))
                    })
                    .catch((err: any) => console.error(err))
            }
            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();

        } finally {
            session.endSession()
        }

    })

}


export default dataSeeder;