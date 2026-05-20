import bcrypt from 'bcrypt'
import {UsersQueryRepository} from "../../users/repositories/users.query.repository";
import {ObjectId} from "mongodb";
import {add} from "date-fns/add";
import {v4 as uuidv4} from 'uuid'
import {UsersCommandRepository} from "../../users/repositories/users.command.repository";
import {emailManager} from "../../managers/emailManager";
import {businessServis} from "../../domain/business.service";
import {EmailAdapter} from "../../adapters/email.adapter";
import {emailExamples} from "../../helpers/email.templates";
import {inject, injectable} from "inversify";
import {LoginInputType} from "../../input-output-types/auth.type";

@injectable()
export class AuthService  {
    constructor(@inject(UsersCommandRepository) private usersCommandRepository: UsersCommandRepository,
    @inject(EmailAdapter) private emailAdapter: EmailAdapter,
    @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository){

    }
    async loginWithEmailOrLogin({loginOrEmail, password}: LoginInputType): Promise<string | null> {
        const user = await this.usersQueryRepository.findUserWithEmailOrLogin(loginOrEmail)
        if (user) {
            const match = await bcrypt.compare(password, user.accountData.passwordHash)
            if (match) {
                return String(user._id)
            }
        }
        return null
    }
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
        const createResult = await this.usersCommandRepository.createUser(user)

        try {
            await emailManager.sendEmailConfirmationMessage(user.accountData.email, user.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            return null
        }
        return createResult
    }
    async confirmEmail(code: string) {
        let user = await this.usersCommandRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        return await this.usersCommandRepository.updateConfirmation(user._id)

    }
    async resendingEmail(email: string) {
        const user = await this.usersCommandRepository.findUserWithEmailOrLogin(email)
        if (!user || user.emailConfirmation.isConfirmed) {
            return null
        }
        await this.usersCommandRepository.updateCode(user._id)
        const updatedUser = await this.usersCommandRepository.findUserWithEmailOrLogin(email)
        await businessServis.sendEmail(updatedUser!.accountData.email, 'Resending email', ' Resending message', updatedUser?.emailConfirmation.confirmationCode)
        return true
    }
    async addTokenToBlackList(oldRefreshToken: string) {
        return await this.usersCommandRepository.tokenToBlackList(oldRefreshToken)
    }
    async checkTokenInBlackList(refreshToken: string) {
        return await this.usersCommandRepository.checkTokenInBlackList(refreshToken)
    }
    async recoveryCode(userId: ObjectId, email: string) {
        const codeRecovrey = uuidv4()
        await this.usersCommandRepository.addRecoveryCode(userId, codeRecovrey)
        await this.emailAdapter.sendEmail(email, 'recovery', 'recovery text message', emailExamples.passwordRecoveryEmail(codeRecovrey))
    }
    async  newPassword(newPassword: string, recoveryCode: string) {

        const user = await this.usersQueryRepository.findUserByRecoveryCode(recoveryCode)
        if (!user) {
            return false
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt)
        return await this.usersCommandRepository.newPassword(user._id, passwordHash)
    }
}