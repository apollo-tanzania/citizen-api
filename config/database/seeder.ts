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
// initialize models variables
const Station = StationModel;
const User = UserModel;
const Admin = AdminModel;
const Permission = PermissionModel;
const StolenPhone = StolenPhoneModel;
const PermissionLog = PermissionLogModel;

const dataSeeder = async() => {

    // User.db.dropCollection("users")
    // Station.db.dropCollection("stations")
    // StolenPhoneModel.db.dropDatabase();
    Permission.db.dropCollection("permissions")
      console.log(await PermissionLogModel.find())



    Station.estimatedDocumentCount(undefined, (err: any, count: number) => {
        if (!err && count === 0) {
            new Station({
                _id: "RB-TBT",
                name: "Tabata",
                location: "Tabata"
            })
                .save((err: any) => {
                    if (err) {
                        return console.log('error', err);
                    }
                    console.log("Tabata Police station added successfully");
                })

            new Station({
                _id: "RB-MBZ",
                name: "Mbezi",
                location: "Mbezi"
            })
                .save((err: any) => {
                    if (err) {
                        return console.log('error', err);
                    }
                    console.log("Mbezi Police Station added successfully");
                })

            new Station({
                _id: "RB-KMR",
                name: "Kimara",
                location: "Kimara"
            })
                .save((err: any) => {
                    if (err) {
                        return console.log('error', err);
                    }
                    console.log("Kimara Police station added successfully");
                })

            new Station({
                _id: "RB-CHA",
                name: "Chamazi",
                location: "Chamazi"
            })
                .save((err: any) => {
                    if (err) {
                        return console.log('error', err);
                    }
                    console.log("Chamazi Police Station added successfully");
                })

        }
    })


    Permission.estimatedDocumentCount(undefined, async (err: any, count: number) => {
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
                                flag: Long.fromNumber(PermissionFlag[key] as unknown as number) ,
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
                        .save((err: any) => {
                            if (err) {
                                return console.log('error', err);
                            }
                            console.log("Permission: " + permission.name + " created successfully with value: " + permission.flag);
                        })
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

    User.estimatedDocumentCount(undefined, async (err: any, count: number) => {
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
                    .save(async (err: any, user: any) => {
                        if (err) {
                            return console.log('error', err);
                        }

                        new Admin({
                            username: user?._id,
                            permissionFlags: 8589934592
                        })
                            .save((err: any, admin: any) => {
                                if (err) {
                                    return console.log('error', err);
                                }

                                console.log("Admin added successfully");

                            })

                    })
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