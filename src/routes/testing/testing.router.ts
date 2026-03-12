import {Router, Request, Response} from "express";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    res.send(204)
})