import {Post, PostDto} from "../../routes/posts-router/posts.router";


const posts: Array<Post> = []

export const postsRepository = {
    getAll() {
        return posts
    },
    getById(id: number) {
        return posts.find(p => p.id === id)
    },
    create(dto: Post) {
        posts.push(dto)
        return dto.id
    },
    delete(id: number) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1)
                return true
            }
        }
        return false
    },
    update(id: number, dto: PostDto) {
        const post = posts.find(p => p.id === id)
        post!.title = dto.title
        post!.blogId = +dto.blogId
        post!.shortDescription = dto.shortDescription
        post!.content = dto.content
        return true
    }
}