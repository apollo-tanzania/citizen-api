import shortid from 'shortid';
import debug from 'debug';
import { CreateUserDto } from '../dto/createUser';
import { PatchUserDto } from '../dto/patchUser';
import { PutUserDto } from '../dto/putUser';
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import UserModel from '../model/user';
import { QueryParams, queryWithPagination } from './utils/createPaginatedQuery';

const log: debug.IDebugger = debug('app:users-dao');

class StationRepository {

    User = UserModel;

    constructor() {
        log('Created new instance of User Repository');
    }

    async addUser(userFields: CreateUserDto) {
        try {
            const userId = shortid.generate();
            const user = new this.User({
                _id: userId,
                ...userFields,
                // permissionFlags: PermissionFlag.FREE_PERMISSION,
                permissionFlags: userFields.permissionFlags
            });
            await user.save();
            return userId;
        } catch (error) {
            throw error
        }

    }

    async getUserByEmail(email: string) {
        return this.User.findOne({ email: email }).exec();
    }

    async getUserByEmailWithPassword(email: string) {
        return this.User.findOne({ email: email })
            .select('_id email permissionFlags role +password')
            .exec();
    }

    async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }

    async getUserById(userId: string) {
        return this.User.findOne({ _id: userId }).populate('User').exec();
    }

    async getUsers(queryParams: QueryParams) {
        return queryWithPagination(this.User, queryParams)
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();

        return existingUser;
    }
}

export default new StationRepository();
