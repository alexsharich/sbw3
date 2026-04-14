import {Router, Request, Response} from "express";
import {blogsCommandRepository} from "../../blogs/repositories/blogs.command.repository";
import {postsCommandRepository} from "../../posts/repositories/posts.command.repository";
import {usersCommandRepository} from "../../users/repositories/users.command.repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsCommandRepository.deleteAllBlogs()
    await postsCommandRepository.deleteAllPosts()
    await usersCommandRepository.deleteAllUsers()
    res.send(204)
})