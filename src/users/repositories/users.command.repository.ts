import {blackListCollection, usersCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {UserAccountDBType, UserModel} from "../../input-output-types/users.type";
import {add} from "date-fns/add";
import {v4 as uuidv4} from 'uuid'
import {injectable} from "inversify";

@injectable()
export class UsersCommandRepository {
    async findUserWithEmailOrLogin(emailOrLogin: string) {
        return UserModel.findOne({$or: [{'accountData.userName': emailOrLogin}, {'accountData.email': emailOrLogin}]})
    }


    async createUser(user: UserAccountDBType): Promise<string | null> {
        try {
            const createdUser = new UserModel(user)
            await createdUser.save()
            return createdUser._id.toString()
        } catch (e) {
            console.log('Create user error : ', e)
            return null
        }
    }

    async deleteUser(id: string) {
        const result = await UserModel.deleteOne({_id: id}).exec()
        return result.deletedCount === 1
    }

    async deleteAllUsers() {
        return await usersCollection.drop()
    }

    async checkUniqUserWithEmailOrLogin(login: string, email: string) {
        return UserModel.findOne({$or: [{'accountData.userName': login}, {'accountData.email': email}]})
    }

    async findUserByConfirmationCode(emailConfirmationCode: string) {
        return await UserModel.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
    }

    async updateConfirmation(userId: any) {
        const result = await UserModel.updateOne({_id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }

    async updateCode(userId: ObjectId) {
        const newExpirationDate = add(new Date(), {hours: 1})
        const user = await UserModel.findById(userId).exec()
        if (!user) {
            throw new Error('not found')
        }
        user.emailConfirmation.expirationDate = newExpirationDate
        user.emailConfirmation.confirmationCode = uuidv4()
        await user.save()
    }

    async tokenToBlackList(oldRefreshToken: string) {
        const oldTokenId = await blackListCollection.insertOne({
            token: oldRefreshToken
        })
        console.log(oldTokenId.acknowledged)
        return oldTokenId.acknowledged
    }

    async checkTokenInBlackList(refreshToken: string) {
        return await blackListCollection.findOne({token: refreshToken})
    }

    async addRecoveryCode(userId: ObjectId, code: string) {
        const user = await UserModel.findOne(userId)
        if (!user) {
            return false
        }
        user.passwordRecovery = code
        await user.save()
        return true
    }

    async newPassword(id: ObjectId, newPassword: string) {
        const user = await UserModel.findById(id)
        if (!user) {
            return false
        }
        user.accountData.passwordHash = newPassword
        await user.save()
        return true
    }
}