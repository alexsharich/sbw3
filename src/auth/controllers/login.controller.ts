import {Request, Response} from "express";
import {jwtServise} from "../../application/jwtService";
import {authService} from "../service/authService";
import {daysToMs} from "../../helpers/days.to.ms";
import {ObjectId} from "mongodb";
import UAParser from "ua-parser-js";
import {devicesService} from "../../devices/services/devices.service";


export type LoginInputType = {
    loginOrEmail: string
    password: string
}
export const loginController = async (req: Request<any, any, LoginInputType>, res: Response) => {
    const userId = await authService.loginWithEmailOrLogin(req.body)
    if (!userId) {
        res.sendStatus(401)
        return
    }

    const _id = new ObjectId()

    const {accessToken, refreshToken} = jwtServise.createToken(userId, String(_id))
    const decodedRefreshToken = jwtServise.decodeToken(refreshToken)
    const ip = req.ip || '1'

    //@ts-ignore
    const {browser, device} = UAParser(req.headers['user-agent']);

    const deviceName = device.model || '' + browser.name || ''

    try {
        await devicesService.saveDevice(_id, ip, deviceName, new Date(decodedRefreshToken?.iat! * 1000).toISOString(), String(decodedRefreshToken?.userId), new Date(decodedRefreshToken?.exp! * 1000).toISOString())
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