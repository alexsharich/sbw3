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
export type UserDBType ={
    passwordHash:string,
    login: string,
    email: string,
    createdAt: string
}