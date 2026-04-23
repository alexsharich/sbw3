import {Request, Response} from "express";
import {jwtServise} from "../../application/jwtService";
import {authService} from "../service/authService";
import {daysToMs} from "../../helpers/days.to.ms";


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
    const {accessToken, refreshToken} = jwtServise.createToken(userId)
    res.cookie('refreshToken', refreshToken, {
        maxAge: (daysToMs(3)),
        httpOnly: true,
        secure: true
    })
    res.status(200).json({accessToken})
}