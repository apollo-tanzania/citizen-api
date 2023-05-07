import permissionRepository from '../repository/permission';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreatePermissionDto } from '../dto/permission/createPermission';
import { PatchPermissionDto } from '../dto/permission/patchPermssion';
import { PutPermissionDto } from '../dto/permission/putPermssion';
import { QueryParams } from '../types';

class PermissionService implements CRUD {
    async create(resource: CreatePermissionDto) {
        return permissionRepository.addPermission(resource);
    }

    async deleteById(id: string) {
        return permissionRepository.removePermissionById(id);
    }

    async list(queryParams: QueryParams) {
        return permissionRepository.getPermissions(queryParams);
    }

    async patchById(id: string, resource: PatchPermissionDto): Promise<any> {
        return permissionRepository.updatePermissionById(id, resource);
    }

    async putById(id: string, resource: PutPermissionDto): Promise<any> {
        return permissionRepository.updatePermissionById(id, resource);
    }

    async readById(id: string) {
        return permissionRepository.getPermissionById(id);
    }
}

export default new PermissionService();
