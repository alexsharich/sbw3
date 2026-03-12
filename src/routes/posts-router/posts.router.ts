import {Router, Request, Response} from "express";
import {postsRepository} from "../../repositories/posts/posts.repository";
import {blogsRepository} from "../../repositories/blogs/blogs.repository";

export const postsRouter = Router({})

export type PostDto = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}
export type Post = {
    id: number
    title: string
    shortDescription: string
    content: string
    blogId: number | undefined
    blogName: string | undefined
}

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getAll()
    res.status(200).send(posts)
})
postsRouter.post('/', (req: Request, res: Response) => {
    const blog = blogsRepository.getById(req.body.blogId)
    if (!blog) {
        res.status(404) // 404 ???
    }
    const newPost: Post = {
        id: new Date().getTime(),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: /*blog?.name*/blogsRepository.getById(+req.body.blogId)?.name
    }
    const postId = postsRepository.create(newPost)
    const post = postsRepository.getById(postId)
    if (!post) {
        res.status(404)
    }
    res.status(201).send(post)
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const post = postsRepository.getById(id)
    if (!post) {
        res.status(404)
    }
    res.status(200).send(post)
})
postsRouter.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const isPostExist = postsRepository.getById(id)
    console.log( 'post exist ',isPostExist)
    if (!isPostExist) {
        res.send(404)
        return
    }
    const dto = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    }
    const isPostCreated = postsRepository.update(id, dto)
    console.log('isPost created',isPostCreated)
    if(!isPostCreated){
        res.send(404)
        return
    }
    res.send(204)
})
postsRouter.delete('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const isDeleted = postsRepository.delete(id)
    if (!isDeleted) {
        res.send(404)
    }
    res.send(204)
})