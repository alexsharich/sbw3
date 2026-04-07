import {Request, Response} from "express";
import {postsRepository} from "../repositories/posts.repository";
import {postsService} from "../services/posts.service";

export const createPostController = async (req: Request, res: Response) => {

    const newPostCreated = await postsService.createPost(req.body)

    if (newPostCreated === null) {
        res.sendStatus(400)
        return
    }

    const newPost = await postsRepository.getById(newPostCreated.toString())
    if (!newPost) {

        res.sendStatus(400)
        return
    }
    res.status(201).json(newPost)
}
