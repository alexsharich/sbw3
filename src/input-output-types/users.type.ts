import {WithId} from "mongodb";

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
}>
type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: any
}