import debug from 'debug';
import ReportModel from '../model/report';
import { CreatePermissionDto } from '../dto/permission/createPermission';
import { PatchPermissionDto } from '../dto/permission/patchPermssion';
import { PutPermissionDto } from '../dto/permission/putPermssion';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';
import PermissionModel from '../model/permission';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';
import customMongooseORMQuery from './utils/customMongooseORMQuery';


const log: debug.IDebugger = debug('app:permissions-dao');

class PermissionRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;
    Permission = PermissionModel;

    constructor() {
        log('Created new instance of Permission Repository');
    }

    async addPermission(permissionFields: CreatePermissionDto) {

        try {
            const permission = new this.Permission({
                ...permissionFields,
            });

            await permission.save();

            return permission?._id;

        } catch (error) {

            return error;

        }
    }

    async removePermissionById(permissionId: string) {
        return this.Permission.deleteOne({ _id: permissionId }).exec();
    }

    async getPermissionById(permissionId: string) {
        return this.Permission.findOne({ _id: permissionId }).exec();
    }

    async getPermissionWithQueryPropertyById(permissionId: string) {
        return customMongooseORMQuery.findById(this.Permission, permissionId)
    }

    async getPermissions(queryParams: QueryParams) {
        return queryWithPagination(this.Permission, queryParams)
    }

    async updatePermissionById(
        permissionId: string,
        permissionFields: PatchPermissionDto | PutPermissionDto
    ) {
        const existingPermission = await this.Permission.findOneAndUpdate(
            { id: permissionId },
            { $set: permissionFields },
            { new: true }
        ).exec();

        return existingPermission;
    }
}

export default new PermissionRepository();
