import {ObjectId, WithId} from "mongodb";
import {OutputUserType, UserAccountDBType, UserDocument, UserModel} from "../../input-output-types/users.type";
import {PaginationQueriesUsersType} from "../../helpers/pagination.values";
import {SortMongoType} from "../../blogs/repositories/blogs.query.repository";
import {injectable} from "inversify";

const mapToOutputUser = (user: WithId<UserAccountDBType>): OutputUserType => {
    return {
        id: user._id.toString(),
        login: user.accountData.userName,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}

interface UserFilter {
    $or?: Array<{ [key: string]: any }>
}
@injectable()
export class UsersQueryRepository  {
    async findUserWithEmailOrLogin(loginOrEmail: string) {
        return await UserModel.findOne({$or: [{'accountData.userName': loginOrEmail}, {'accountData.email': loginOrEmail}]})
    }
    async checkUniqUserWithEmailOrLogin(login: string, email: string) {
        return await UserModel.findOne({$or: [{'accountData.userName': login}, {'accountData.email': email}]})
    }
    async findUser(id: string): Promise<OutputUserType | null> {
        try {
            const userId = new ObjectId(id)
            const user = await UserModel.findOne({_id: userId})
            if (user) return mapToOutputUser(user)
            return null
        } catch (e) {
            console.log('User repository, find user / find user ', e)
            return null
        }
    }
    async getUsers(query: PaginationQueriesUsersType) {
        try {
            const pageNumber = query.pageNumber
            const pageSize = query.pageSize
            const sortBy = query.sortBy
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1
            const searchLoginTerm = query.searchLoginTerm
            const searchEmailTerm = query.searchEmailTerm

            let filter: UserFilter = {}

            if (searchLoginTerm || searchEmailTerm) {
                filter = {
                    $or: []
                };

                if (searchLoginTerm) {
                    filter.$or?.push({login: {$regex: searchLoginTerm, $options: 'i'}});
                }
                if (searchEmailTerm) {
                    filter.$or?.push({email: {$regex: searchEmailTerm, $options: 'i'}});
                }
            }

            const sortFilter: SortMongoType = {[sortBy]: sortDirection} as SortMongoType

            const users = await UserModel.find(filter)
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
            const totalCount = await UserModel.countDocuments(filter)
            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: users.map((user: UserDocument) => mapToOutputUser(user))
            }
        } catch (e) {
            throw new Error('Users not found')
        }
    }

    async findUserByRecoveryCode(passwordRecovery: string) {
        return await UserModel.findOne({passwordRecovery})
    }
}