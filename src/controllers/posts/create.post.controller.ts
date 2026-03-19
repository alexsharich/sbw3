import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs/blogs.repository";
import {postsRepository} from "../../repositories/posts/posts.repository";
import {Post} from "../../routes/posts-router/posts.router";

export const createPostController = (req: Request, res: Response) => {
    /*const blog = blogsRepository.getById(req.body.blogId)
    if (!blog) {
        res.status(404) // 404 ???
    }
    const newPost: Post = {
        id: new Date().getTime(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: /!*blog?.name*!/blogsRepository.getById(+req.body.blogId)?.name
    }
    const postId = postsRepository.create(newPost)
    const post = postsRepository.getById(postId)
    if (!post) {
        res.status(404)
    }
    res.status(201).send(post)*/
}
