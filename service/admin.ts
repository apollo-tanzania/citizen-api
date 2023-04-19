import AdminRepository from '../repository/admin';
import UsersDao from '../repository/user';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/createUser';
import { PutUserDto } from '../dto/putUser';
import { PatchUserDto } from '../dto/patchUser';

class AdminsService implements CRUD {
    async create(resource: CreateUserDto) {
        return AdminRepository.addAdmin(resource);
    }

    async deleteById(id: string) {
        return AdminRepository.removeAdminById(id);
    }

    async list(limit: number, page: number) {
        return AdminRepository.getAdmins(limit, page);
    }

    async patchById(id: string, resource: PatchUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource);
    }

    async putById(id: string, resource: PutUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource);
    }

    async readById(id: string) {
        return AdminRepository.getAdminById(id);
    }

    async getAdminByEmail(email: string) {
        return AdminRepository.getAdminByEmail(email);
    }
    // async getUserByEmailWithPassword(email: string) {
    //     return UsersDao.getUserByEmailWithPassword(email);
    // }
}

export default new AdminsService();