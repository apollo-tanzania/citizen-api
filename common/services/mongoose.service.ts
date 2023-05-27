import mongoose from 'mongoose';
import debug from 'debug';
import dataSeeder from '../../config/database/seeder';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        useFindAndModify: false,
        ignoreUndefined: true
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    getConnection() {
        // const connection = mongoose.connection;
        // connection.on()

        return mongoose.connection;
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)');
        mongoose
            .connect('mongodb://localhost:27017/api-db-imeis', this.mongooseOptions)
            .then(() => {
                log('MongoDB is connected');

            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });

    };
}
export default new MongooseService();
