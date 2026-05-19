import {blackListCollection, usersCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {UserAccountDBType} from "../../input-output-types/users.type";
import {add} from "date-fns/add";
import {v4 as uuidv4} from 'uuid'
import {injectable} from "inversify";

@injectable()
export class UsersCommandRepository {
    async findUserWithEmailOrLogin(emailOrLogin: string) {
        return await usersCollection.findOne({$or: [{login: emailOrLogin}, {email: emailOrLogin}]})
    }


    async createUser(user: UserAccountDBType): Promise<string | null> {
        try {
            const createdUser = await usersCollection.insertOne(user)
            return createdUser.insertedId.toString()
        } catch (e) {
            console.log('Create user error : ', e)
            return null
        }
    }

    async deleteUser(id: string) {
        try {
            const userId = new ObjectId(id)
            const result = await usersCollection.deleteOne({_id: userId})
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    }

    async deleteAllUsers() {
        return await usersCollection.drop()
    }

    async checkUniqUserWithEmailOrLogin(login: string, email: string) {
        return await usersCollection.findOne({$or: [{login: login}, {email: email}]})
    }

    async findUserByConfirmationCode(emailConfirmationCode: string) {
        return await usersCollection.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})

    }

    async updateConfirmation(userId: any) {
        const result = await usersCollection.updateOne({_id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }

    async updateCode(userId: ObjectId) {
        const newExpirationDate = add(new Date(), {hours: 1})
        await usersCollection.updateOne({_id: userId}, {
            $set: {
                'emailConfirmation.expirationDate': newExpirationDate,
                'emailConfirmation.confirmationCode': uuidv4(),
            }
        })
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
        const result = await usersCollection.updateOne({_id: userId}, {$set: {passwordRecovery: code}})
        const user = await usersCollection.findOne({_id: userId})
        console.log("USER : ", user)
        return result.modifiedCount === 1
    }

    async newPassword(id: ObjectId, newPassword: string) {
        const result = await usersCollection.updateOne({_id: id}, {$set: {'accountData.passwordHash': newPassword}})
        return result.modifiedCount === 1
    }
}