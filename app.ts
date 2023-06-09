import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './routes/user';
import { AuthRoutes } from './routes/auth';
import debug from 'debug';
import helmet from 'helmet';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import { options } from './apiDocConfig'
import { ReportsRoutes } from './routes/report';
import dataSeeder from './config/database/seeder';
import { StationsRoutes } from './routes/station';
import { AdminsRoutes } from './routes/admin';
import { PhonesRoutes } from './routes/phone';
import { LawEnforcementRoutes } from './routes/lawEnforcement';
import { LawEnforcementVerificationHistoryRoutes } from './routes/lawEnforcementsVerificationHistory';
import errorHandler from './middleware/errorHandler';
import { ImeiRoutes } from './routes/imei';
import { PermissionRoutes } from './routes/permission';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());
app.use(cors({
    origin: "*"
}))
app.use(helmet());

expressJSDocSwagger(app)(options);

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, make terse
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
    }
}

app.use(expressWinston.logger(loggerOptions));


routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new ReportsRoutes(app));
routes.push(new StationsRoutes(app));
routes.push(new AdminsRoutes(app));
routes.push(new PhonesRoutes(app));
routes.push(new LawEnforcementRoutes(app));
routes.push(new LawEnforcementVerificationHistoryRoutes(app));
routes.push(new ImeiRoutes(app));
routes.push(new PermissionRoutes(app));

app.use(errorHandler)

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});
export default server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
    dataSeeder();
});
