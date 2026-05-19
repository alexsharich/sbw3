import {UsersCommandRepository} from "../repositories/users.command.repository";
import {InputUserType} from "../../input-output-types/users.type";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {add} from "date-fns/add";
import {v4 as uuidv4} from "uuid";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(@inject(UsersCommandRepository) private usersCommandRepository: UsersCommandRepository) {
    }
    async createUser(user: InputUserType, isAdmin: boolean = false) {
        const errors = []
        const isUnique = await this.usersCommandRepository.checkUniqUserWithEmailOrLogin(user.login, user.email)
        if (isUnique) {
            if (isUnique.accountData.email === user.email) {
                errors.push({field: 'email', message: 'email should be unique'})
            }
            if (isUnique.accountData.userName === user.login) {
                errors.push({field: 'email', message: 'login should be unique'})
            }
            return errors
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        const now = new Date()
        const newUser = {
            _id: new ObjectId(),
            accountData: {
                userName: user.login,
                email: user.email,
                passwordHash: hash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(now, {
                    hours: 1,
                }),
                isConfirmed: isAdmin ? true : false
            }
        }
        return await this.usersCommandRepository.createUser(newUser)
    }
    async deleteUser(id: string): Promise<boolean> {
        return await this.usersCommandRepository.deleteUser(id)
    }
}