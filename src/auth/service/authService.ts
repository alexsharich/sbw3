import {LoginInputType} from "../controllers/login.controller";
import bcrypt from 'bcrypt'
import {usersQueryRepository} from "../../users/repositories/users.query.repository";


export const authService = {
    async loginWithEmailOrLogin({loginOrEmail, password}: LoginInputType): Promise<string | null> {
        const user = await usersQueryRepository.findUserWithEmailOrLogin(loginOrEmail)
        if (user) {
            const match = await bcrypt.compare(password, user.passwordHash)
            if (match) {
                return String(user._id)
            }
        }
        return null
    }
}