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
import ImeiModel from "../../model/imei";
import { log } from "winston";
// initialize models variables
const Station = StationModel;
const User = UserModel;
const Admin = AdminModel;
const Permission = PermissionModel;
const StolenPhone = StolenPhoneModel;
const PermissionLog = PermissionLogModel;
const Report = LostPhoneReportModel;
const Imei = ImeiModel;

const imeiList = [
    {
        "deviceSpecification": {
            "simSlots": 1,
            "operatingSystem": "Android 10.0",
            "operatingSystemFamily": "Android",
            "aliases": [
                "G020M",
                "G020I",
                "GA01188-US",
                "GA01187-US",
                "GA01189-US",
                "GA01191-US"
            ],
            "bluetooth": [
                "5.0",
                "A2DP",
                "LE",
                "aptX HD"
            ],
            "usb": [
                "3.1",
                "Type-C 1.0 reversible connector"
            ],
            "wlan": [
                "Wi-Fi 802.11 a/b/g/n/ac",
                "dual-band",
                "Wi-Fi Direct",
                "DLNA",
                "hotspot"
            ],
            "nfc": true,
            "speed": [
                "HSPA 42.2/5.76 Mbps",
                "LTE-A (5CA) Cat18 1200/150 Mbps"
            ],
            "nettech": []
        },
        "valid": true,
        "models": [
            "G020N"
        ],
        "frequency": [
            "LTE FDD BAND 1",
            "LTE FDD BAND 2",
            "LTE FDD BAND 3",
            "LTE FDD BAND 4",
            "LTE FDD BAND 5",
            "LTE FDD BAND 7",
            "LTE FDD BAND 8",
            "LTE FDD BAND 12",
            "LTE FDD BAND 13",
            "LTE FDD BAND 17",
            "LTE FDD BAND 18",
            "LTE FDD BAND 19",
            "LTE FDD BAND 20",
            "LTE FDD BAND 21",
            "LTE FDD BAND 25",
            "LTE FDD BAND 26",
            "LTE FDD BAND 28",
            "LTE FDD Band 66",
            "LTE TDD BAND 38",
            "LTE TDD BAND 40",
            "LTE TDD BAND 41",
            "LTE TDD BAND 42",
            "GSM850 (GSM800)",
            "GSM 900",
            "GSM 1800",
            "GSM 1900",
            "WCDMA FDD Band 1",
            "WCDMA FDD Band 2",
            "WCDMA FDD Band 4",
            "WCDMA FDD Band 5",
            "WCDMA FDD Band 6",
            "WCDMA FDD Band 8"
        ],
        "blackListStatus": false,
        "number": "352933100520747",
        "tac": "35293310",
        "serial": "052074",
        "checkDigit": "7",
        "brand": "Google",
        "name": "Pixel 4",
        "_model": "G020N",
        "manufacturer": "Google Inc"
    },
    {
        "deviceSpecification": {
            "simSlots": 2,
            "operatingSystem": null,
            "operatingSystemFamily": "",
            "aliases": [],
            "bluetooth": null,
            "usb": null,
            "wlan": null,
            "nfc": null,
            "speed": null,
            "nettech": []
        },
        "valid": true,
        "models": [
            "FP789L-T"
        ],
        "frequency": [
            "LTE FDD BAND 1",
            "LTE FDD BAND 3",
            "LTE FDD BAND 7",
            "LTE FDD BAND 8",
            "LTE FDD BAND 20",
            "GSM850 (GSM800)",
            "GSM 900",
            "GSM 1800",
            "GSM 1900",
            "WCDMA FDD Band 1",
            "WCDMA FDD Band 8"
        ],
        "blackListStatus": false,
        "number": "864934040840626",
        "tac": "86493404",
        "serial": "084062",
        "checkDigit": "6",
        "brand": "FortuneShip",
        "name": "FortuneShip FP789L-T",
        "_model": "FP789L-T",
        "manufacturer": "Guizhou Fortuneship Technology Co Ltd"
    },
    {
        "deviceSpecification": {
            "simSlots": 1,
            "operatingSystem": "Android 10.0",
            "operatingSystemFamily": "Android",
            "aliases": [
                "G020M",
                "G020I",
                "GA01188-US",
                "GA01187-US",
                "GA01189-US",
                "GA01191-US"
            ],
            "bluetooth": [
                "5.0",
                "A2DP",
                "LE",
                "aptX HD"
            ],
            "usb": [
                "3.1",
                "Type-C 1.0 reversible connector"
            ],
            "wlan": [
                "Wi-Fi 802.11 a/b/g/n/ac",
                "dual-band",
                "Wi-Fi Direct",
                "DLNA",
                "hotspot"
            ],
            "nfc": true,
            "speed": [
                "HSPA 42.2/5.76 Mbps",
                "LTE-A (5CA) Cat18 1200/150 Mbps"
            ],
            "nettech": []
        },
        "valid": true,
        "models": [
            "G020N"
        ],
        "frequency": [
            "LTE FDD BAND 1",
            "LTE FDD BAND 2",
            "LTE FDD BAND 3",
            "LTE FDD BAND 4",
            "LTE FDD BAND 5",
            "LTE FDD BAND 7",
            "LTE FDD BAND 8",
            "LTE FDD BAND 12",
            "LTE FDD BAND 13",
            "LTE FDD BAND 17",
            "LTE FDD BAND 18",
            "LTE FDD BAND 19",
            "LTE FDD BAND 20",
            "LTE FDD BAND 21",
            "LTE FDD BAND 25",
            "LTE FDD BAND 26",
            "LTE FDD BAND 28",
            "LTE FDD Band 66",
            "LTE TDD BAND 38",
            "LTE TDD BAND 40",
            "LTE TDD BAND 41",
            "LTE TDD BAND 42",
            "GSM850 (GSM800)",
            "GSM 900",
            "GSM 1800",
            "GSM 1900",
            "WCDMA FDD Band 1",
            "WCDMA FDD Band 2",
            "WCDMA FDD Band 4",
            "WCDMA FDD Band 5",
            "WCDMA FDD Band 6",
            "WCDMA FDD Band 8"
        ],
        "blackListStatus": false,
        "number": "352933100520754",
        "tac": "35293310",
        "serial": "052075",
        "checkDigit": "4",
        "brand": "Google",
        "name": "Pixel 4",
        "_model": "G020N",
        "manufacturer": "Google Inc"
    },
    {
        "deviceSpecification": {
            "simSlots": 2,
            "operatingSystem": null,
            "operatingSystemFamily": "",
            "aliases": [],
            "bluetooth": null,
            "usb": null,
            "wlan": null,
            "nfc": null,
            "speed": null,
            "nettech": []
        },
        "valid": true,
        "models": [
            "FP789L-T"
        ],
        "frequency": [
            "LTE FDD BAND 1",
            "LTE FDD BAND 3",
            "LTE FDD BAND 7",
            "LTE FDD BAND 8",
            "LTE FDD BAND 20",
            "GSM850 (GSM800)",
            "GSM 900",
            "GSM 1800",
            "GSM 1900",
            "WCDMA FDD Band 1",
            "WCDMA FDD Band 8"
        ],
        "blackListStatus": false,
        "number": "864934040840634",
        "tac": "86493404",
        "serial": "084063",
        "checkDigit": "4",
        "brand": "FortuneShip",
        "name": "FortuneShip FP789L-T",
        "_model": "FP789L-T",
        "manufacturer": "Guizhou Fortuneship Technology Co Ltd"
    }
]


const dataSeeder = async () => {

    // User.db.dropCollection("users")
    // Station.db.dropCollection("stations")
    // StolenPhoneModel.db.dropDatabase();
    // Permission.db.dropCollection("permissions")
    // console.log(Permission.db.collections)
    // StolenPhone.db.dropCollection("stolenphones")
    // Report.db.dropCollection("reports")
    // Imei.db.dropCollection("imeis")

    // StolenPhone.countDocuments((err: Error, count: number) => {
    //     if (!err && count !== 0) {
    //         StolenPhone.db.dropCollection("stolenphones")
    //     }
    // })

    // Report.countDocuments((err: Error, count: number) => {
    //     if (!err && count !== 0) {
    //         Report.db.dropCollection("reports")
    //     }
    // })

    // return

    Imei.countDocuments()
        .then(count => {
            if (count === 0) {
                Imei.insertMany(imeiList)
                    .then((docs: any) => console.log(`${docs}Imeis are saved successfully`))
                    .catch((err: any) => console.error(err))
            }
        })
        .catch((err: Error) => {
            throw err
        })

    Station.countDocuments()
    .then(count => {
        if ( count === 0) {
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
    .catch((err: Error) => {
        throw err;
    })

    Permission.countDocuments()
    .then(async count => {
        const { startSession } = mongooseService.getMongoose()
        const session = await startSession();

        session.startTransaction();
        try {
            if (count === 0) {

                let permissionsList = []

                for (const key in PermissionFlag) {
                    if (Object.hasOwnProperty.call(PermissionFlag, key)) {
                        if (!parseInt(key)) {
                            permissionsList.push({
                                name: key,
                                genericName: key.replace(/_/g, " "),
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
    .catch((err: Error) => {
        throw err
    })

    User.countDocuments()
    .then(async count => {
        const { startSession } = mongooseService.getMongoose()
        const session = await startSession();

        session.startTransaction();
        try {
            if (count === 0) {
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
    .catch((err: Error)=> {
        throw err;
    })

}


export default dataSeeder;