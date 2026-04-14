import {usersCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {UserDBType} from "../../input-output-types/users.type";

export const usersCommandRepository = {
    async createUser(user: UserDBType): Promise<string | null> {
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
}