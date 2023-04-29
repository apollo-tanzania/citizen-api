import debug from 'debug';
import ReportModel from '../model/report';
import { PatchPhoneDto } from '../dto/phone/patchPhone';
import { PutPhoneDto } from '../dto/phone/putPhone';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';
import PermissionModel from '../model/permission';
import PermissionLogModel from '../model/permissionLog';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';


const log: debug.IDebugger = debug('app:permissions-dao');

class PermissionRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;
    Permission = PermissionModel;
    PermissionLog = PermissionLogModel;


    constructor() {
        log('Created new instance of Permission Log Repository');
    }

    async addPermissionLog(permissionLogFields: CreatePhoneDto) {

        try {
            const permissionLog = new this.PermissionLog({
                ...permissionLogFields,
            });

            await permissionLog.save();

            return permissionLog?._id;

        } catch (error) {

            return error;

        }
    }

    async removePermissionLogById(permissionLogId: string) {
        return this.PermissionLog.deleteOne({ _id: permissionLogId }).exec();
    }

    async getPermissionLogById(permissionId: string) {
        return this.PermissionLog.findOne({ _id: permissionId }).exec();
    }

    async getPermissionLogs(queryParams: QueryParams) {
        return queryWithPagination(this.PermissionLog, queryParams)
    }

    async updatePermissionById(
        permissionId: string,
        permissionFields: PatchPhoneDto | PutPhoneDto
    ) {
        const existingPermission = await this.PermissionLog.findOneAndUpdate(
            { id: permissionId },
            { $set: permissionFields },
            { new: true }
        ).exec();

        return existingPermission;
    }
}

export default new PermissionRepository();
