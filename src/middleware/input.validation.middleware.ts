import {validationResult} from "express-validator";
import {Request, Response} from 'express'

export const inputValidationMiddleware = (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
    }
}