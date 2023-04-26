import debug from 'debug';
import ReportModel from '../model/report';
import { PatchPhoneDto } from '../dto/phone/patchPhone';
import { PutPhoneDto } from '../dto/phone/putPhone';
import { CreatePhoneDto } from '../dto/phone/createPhone';
import PhoneModel from '../model/phone';
import StolenPhoneModel from '../model/stolenPhone';
import PermissionModel from '../model/permission';

const log: debug.IDebugger = debug('app:permissions-dao');

class PermissionRepository {

    Report = ReportModel;
    Phone = PhoneModel;
    StolenPhone = StolenPhoneModel;
    Permission = PermissionModel;

    constructor() {
        log('Created new instance of Permission Repository');
    }

    async addPermission(permissionFields: CreatePhoneDto) {

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
        return this.Permission.deleteOne({ id: permissionId }).exec();
    }

    async getPermissionById(permissionId: string) {
        return this.Permission.findOne({ id: permissionId }).exec();
    }

    async getPermissions(limit = 10, page = 0) {
        return this.Permission.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updatePermissionById(
        permissionId: string,
        permissionFields: PatchPhoneDto | PutPhoneDto
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
