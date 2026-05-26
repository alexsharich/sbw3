import {WithId} from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";

export type OutputUserType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type InputUserType = {
    login: string,
    password: string,
    email: string
}
export type UserDBType = {
    passwordHash: string,
    login: string,
    email: string,
    createdAt: string
}
type UserAccountType = {
    email: string
    userName: string
    passwordHash: string
    createdAt: string
}
export type UserAccountDBType = WithId<{
    accountData: UserAccountType
    emailConfirmation: EmailConfirmationType
    passwordRecovery?: string
}>
type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
}

export type UserModelType = Model<UserAccountDBType>
export type UserDocument = HydratedDocument<UserAccountDBType>

const UserAccountSchema = new Schema<UserAccountType>({
    email: {type: String, required: true},
    userName: {type: String, required: true},
    passwordHash: {type: String, required: true},
    createdAt: {type: String, required: true}
})

const EmailConfirmationSchema = new Schema<EmailConfirmationType>({
    isConfirmed: {type: Boolean, required: false},
    confirmationCode: {type: String},
    expirationDate: {type: Date}
})
const UserSchema = new Schema<UserAccountDBType>({
    accountData: {type: UserAccountSchema, required: true},
    emailConfirmation: {type: EmailConfirmationSchema, required: true},
    passwordRecovery: {type: String, required: false}
})
export const UserModel = model<UserAccountDBType, UserModelType>('users', UserSchema)