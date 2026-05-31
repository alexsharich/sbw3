import {container} from "../../composition-root";
import {JwtService} from "../../application/jwtService";
import {NextFunction, Request, Response} from "express";

const jwtService = container.get(JwtService)
export const userIdentificationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];

    const token = auth?.split(' ')[1]
    req.userId = jwtService.decodeToken(token)?.userId || undefined

    next()
}