import {Request, Response} from "express";
import {postsRepository} from "../../repositories/posts/posts.repository";

export const getPostsController =(req: Request, res: Response) => {
    const posts = postsRepository.getAll()
    res.status(200).send(posts)
}