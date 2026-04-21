import {usersCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {UserAccountDBType} from "../../input-output-types/users.type";
import {add} from "date-fns/add";
import {v4 as uuidv4} from 'uuid'

export const usersCommandRepository = {
    async findUserWithEmailOrLogin(emailOrLogin: string) {
        return await usersCollection.findOne({$or: [{login: emailOrLogin}, {email: emailOrLogin}]})
    },
    async createUser(user: UserAccountDBType): Promise<string | null> {
        try {
            const createdUser = await usersCollection.insertOne(user)
            return createdUser.insertedId.toHexString()
        } catch (e) {
            console.log('Create blog error : ', e)
            return null
        }
    },
    async deleteUser(id: string) {
        try {
            const userId = new ObjectId(id)
            const result = await usersCollection.deleteOne({_id: userId})
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    },
    async deleteAllUsers() {
        return await usersCollection.drop()
    },
    async checkUniqUserWithEmailOrLogin(login: string, email: string) {
        return await usersCollection.findOne({$or: [{login: login}, {email: email}]})
    },
    async findUserByConfirmationCode(emailConfirmationCode: string) {
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
        return user
    },
    async updateConfirmation(userId: any) {
        const result = await usersCollection.updateOne({_id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },
    async updateCode(userId: ObjectId) {
        const newExpirationDate = add(new Date(), {hours: 1})
        await usersCollection.updateOne({_id: userId}, {
            $set: {
                'emailConfirmation.expirationDate': newExpirationDate,
                'emailConfirmation.confirmationCode': uuidv4(),
            }
        })
    },
}