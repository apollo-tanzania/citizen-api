import UsersDao from '../repository/user';
import { CRUD } from '../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/createUser';
import { PutUserDto } from '../dto/putUser';
import { PatchUserDto } from '../dto/patchUser';
import { QueryParams } from '../repository/utils/createPaginatedQuery';

class UsersService implements CRUD {
    async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource);
    }

    async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }

    async list(queryParams: QueryParams) {
        return UsersDao.getUsers(queryParams);
    }

    async patchById(id: string, resource: PatchUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource);
    }

    async putById(id: string, resource: PutUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource);
    }

    async readById(id: string) {
        return UsersDao.getUserById(id);
    }

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }
    async getUserByEmailWithPassword(email: string) {
        return UsersDao.getUserByEmailWithPassword(email);
    }
}

export default new UsersService();
