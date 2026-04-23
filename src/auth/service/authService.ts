import {LoginInputType} from "../controllers/login.controller";
import bcrypt from 'bcrypt'
import {usersQueryRepository} from "../../users/repositories/users.query.repository";
import {ObjectId} from "mongodb";
import {add} from "date-fns/add";
import {v4 as uuidv4} from 'uuid'
import {usersCommandRepository} from "../../users/repositories/users.command.repository";
import {emailManager} from "../../managers/emailManager";
import {businessServis} from "../../domain/business.service";


export const authService = {
    async loginWithEmailOrLogin({loginOrEmail, password}: LoginInputType): Promise<string | null> {
        const user = await usersQueryRepository.findUserWithEmailOrLogin(loginOrEmail)
        if (user) {
            const match = await bcrypt.compare(password, user.accountData.passwordHash)
            if (match) {
                return String(user._id)
            }
        }
        return null
    },
    async createUser(login: string, email: string, password: string) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt)
        const now = new Date()
        const user = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(now, {
                    hours: 1,
                }),
                isConfirmed: false
            }
        }
        const createResult = await usersCommandRepository.createUser(user)

        try {
            await emailManager.sendEmailConfirmationMessage(user.accountData.email, user.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            return null
        }
        return createResult
    },
    async confirmEmail(code: string) {
        let user = await usersCommandRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        return await usersCommandRepository.updateConfirmation(user._id)

    },
    async resendingEmail(email: string) {
        const user = await usersCommandRepository.findUserWithEmailOrLogin(email)
        if (!user || user.emailConfirmation.isConfirmed) {
            return null
        }
        await usersCommandRepository.updateCode(user._id)
        const updatedUser = await usersCommandRepository.findUserWithEmailOrLogin(email)
        await businessServis.sendEmail(updatedUser!.accountData.email, 'Resending email', ' Resending message', updatedUser?.emailConfirmation.confirmationCode)
        return true
    },
    async addTokenToBlackList(oldRefreshToken: string) {
        return await usersCommandRepository.tokenToBlackList(oldRefreshToken)
    },
    async checkTokenInBlackList(refreshToken: string) {
        return await usersCommandRepository.checkTokenInBlackList(refreshToken)
    }
}