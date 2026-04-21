import {authService} from "../service/authService";
import {Request, Response} from "express";

export const registrationEmailResendingController = async (req: Request, res: Response) => {
    const user = await authService.resendingEmail(req.body.email)
    if (!user) {
        res.status(400).send({errorsMessages: [{message: '123123', field: "email"}]})
        return
    }
    res.status(204).send()
}