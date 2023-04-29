import AdminRepository from '../repository/admin';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/createUser';
import { PutUserDto } from '../dto/putUser';
import { PatchUserDto } from '../dto/patchUser';
import { PatchPermissionChangeDto } from '../dto/permissionLog/patchPermissionChange';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class AdminsService implements CRUD {
    async create(resource: CreateUserDto) {
        return AdminRepository.addAdmin(resource);
    }

    async deleteById(id: string) {
        return AdminRepository.removeAdminById(id);
    }

    async list(queryParams: QueryParams) {
        return AdminRepository.getAdmins(queryParams);
    }

    async patchById(id: string, resource: PatchUserDto): Promise<any> {
        return AdminRepository.updateAdminById(id, resource);
    }

    async putById(id: string, resource: PutUserDto): Promise<any> {
        return AdminRepository.updateAdminById(id, resource);
    }

    async readById(id: string) {
        return AdminRepository.getAdminById(id);
    }

    async getAdminByEmail(email: string) {
        return AdminRepository.getAdminByEmail(email);
    }

    async updatePermissionById(id: string, resource: PatchPermissionChangeDto): Promise<any> {
        return AdminRepository.updateAdminPermissionById(id, resource);

    }
    // async getUserByEmailWithPassword(email: string) {
    //     return UsersDao.getUserByEmailWithPassword(email);
    // }
}

export default new AdminsService();
