import {Request, Response} from "express";
import {blogsService} from "../services/blogs.service";
import {postsService} from "../../posts/services/posts.service";
import {InputPostForBlogType} from "../../input-output-types/posts.type";

export const createPostForSelectedBlogController = async (req: Request<{
    id: string
}, {}, InputPostForBlogType>, res: Response) => {
    const newPostCreated = await blogsService.createPostForSelectedBlog({blogId: req.params.id, body: req.body})
    if (newPostCreated === null) {
        res.sendStatus(407)
        return
    }
    const newPost = await postsService.findPost(newPostCreated)
    if (!newPost) {
        res.sendStatus(406)
        return
    }
    res.status(201).json(newPost)
}