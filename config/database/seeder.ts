import StationModel from "../../model/station";
import UserModel from "../../model/user";
import argon2 from 'argon2';
import AdminModel from "../../model/admin";
import shortid from "shortid";
import mongooseService from "../../common/services/mongoose.service";
import StolenPhoneModel from "../../model/stolenPhone";

// initialize models variables
const Station = StationModel;
const User = UserModel;
const Admin = AdminModel;
const StolenPhone = StolenPhoneModel;

const dataSeeder = () => {

    // User.db.dropCollection("users")
    // Station.db.dropCollection("stations")
    // StolenPhoneModel.db.dropDatabase();

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
                            permissionFlags: 8
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