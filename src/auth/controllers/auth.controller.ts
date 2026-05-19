import {AuthService} from "../service/authService";
import {ObjectId} from "mongodb";
import UAParser from "ua-parser-js";
import {DevicesService, } from "../../devices/services/devices.service";
import {daysToMs} from "../../helpers/days.to.ms";
import {Request, Response} from "express";
import {LoginInputType} from "./login.controller";
import {UsersQueryRepository} from "../../users/repositories/users.query.repository";
import {UsersCommandRepository} from "../../users/repositories/users.command.repository";
import {inject, injectable} from "inversify";
import "reflect-metadata"
import {JwtService} from "../../application/jwtService";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) private authService: AuthService,
                @inject(JwtService) private jwtService: JwtService,
                @inject(DevicesService) private devicesService: DevicesService,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(UsersCommandRepository) private usersRepository: UsersCommandRepository) {

    }

    async login(req: Request<any, any, LoginInputType>, res: Response) {
        const userId = await this.authService.loginWithEmailOrLogin(req.body)
        if (!userId) {
            res.sendStatus(401)
            return
        }

        const _id = new ObjectId()

        const {accessToken, refreshToken} = this.jwtService.createToken(userId, String(_id))
        const decodedRefreshToken = this.jwtService.decodeToken(refreshToken)
        const ip = req.ip || '1'

        //@ts-ignore
        const {browser, device} = UAParser(req.headers['user-agent']);

        const deviceName = device.model || '' + browser.name || ''

        try {
            await this.devicesService.saveDevice(_id, ip, deviceName, new Date(decodedRefreshToken?.iat! * 1000).toISOString(), String(decodedRefreshToken?.userId), new Date(decodedRefreshToken?.exp! * 1000).toISOString())
        } catch (error) {
            throw new Error('Error')
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: (daysToMs(3)),
            httpOnly: true,
            secure: true
        })
        res.status(200).json({accessToken})
    }

    async logout(req: Request, res: Response) {
        const deviceId = req.deviceId
        const userId = req.userId
        await this.devicesService.deleteDeviceById(deviceId!, userId!)
        res.clearCookie('refreshToken')
        res.status(204).send()
    }

    async me(req: Request<any, any, any>, res: Response) {
        const userId = req.userId
        if (userId) {
            const user = await this.usersQueryRepository.findUser(userId)
            if (user) {
                res.status(200).send({
                    email: user.email,
                    login: user.login,
                    userId: user.id
                })
            }
            return
        }
        res.sendStatus(401)
    }

    async refreshToken(req: Request, res: Response) {
        const userId = req.userId
        const deviceId = req.deviceId
        if (!userId) {
            res.sendStatus(401)
            return
        }

        const {accessToken, refreshToken} = this.jwtService.createToken(userId, String(deviceId))
        const tokenDecoded = this.jwtService.decodeToken(refreshToken)

        if (!tokenDecoded) {
            res.sendStatus(401)
            return
        }
        await this.devicesService.updateDevice(new ObjectId(deviceId!), new Date(tokenDecoded?.exp! * 1000).toISOString(), new Date(tokenDecoded?.iat! * 1000).toISOString())

        res.cookie('refreshToken', refreshToken, {
            maxAge: (daysToMs(3)),
            httpOnly: true,
            secure: true
        })
        res.status(200).json({accessToken})
    }

    async registrationConfirmation(req: Request, res: Response) {
        const result = await this.authService.confirmEmail(req.body.code)
        if (!result) {
            res.status(400).send({
                "errorsMessages": [
                    {
                        "message": "invalid code",
                        "field": "code"
                    }
                ]
            })
            return
        } else {
            res.status(204).send()
        }
    }
    async registration (req:Request,res:Response){
    const user = await this.authService.createUser(req.body.login,req.body.email,req.body.password)
    if(user){
        res.status(204).send()
    }else {
    res.status(400).send( { errorsMessages: [{ message: "Email error", field: "email" }] })
}
}
    async resendRegistrationCode (req: Request, res: Response) {
    const user = await this.authService.resendingEmail(req.body.email)
    if (!user) {
    res.status(400).send({errorsMessages: [{message: '123123', field: "email"}]})
    return
}
res.status(204).send()
}
    async newPassword(req: Request<{}, {}, {
        newPassword: string,
        recoveryCode: string
    }>, res: Response) {
        const result = await this.authService.newPassword(req.body.newPassword, req.body.recoveryCode)
        if (!result) {
            res.status(400).send({
                errorsMessages:
                    [{
                        message: "Recovery code incorrect", field: "recoveryCode",
                    },],
            })
            return
        }
        res.sendStatus(204)
    }
    async passwordRecovery(req: Request<{}, {}, { email: string }, {}>, res: Response) {
        const user = await this.usersQueryRepository.findUserWithEmailOrLogin(req.body.email)
        if (user) {
            await this.authService.recoveryCode(user._id, req.body.email)
        }
        res.sendStatus(204)
    }
}