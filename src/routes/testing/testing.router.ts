import {Router, Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs/blogs.repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs()
    res.send(204)
})