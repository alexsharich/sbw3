import {BlogDto,} from "../../routes/blogs-router/blogs.router";

type Blog = {
    id: number,
    name: string,
    description: string,
    websiteUrl: string
}
const blogs: Array<Blog> = [{
    id: 1,
    name: ' first blog',
    description: 'description for first blog',
    websiteUrl: 'www.website.url'
},
    {
        id: 2,
        name: ' second blog',
        description: 'description for second blog',
        websiteUrl: 'www.2second.url'
    }]


export const blogsRepository = {
    getAll() {
        return blogs
    },
    create(dto: Blog) {
        blogs.push(dto)
        return dto.id
    },
    getById(id: number) {
        return blogs.find(b => b.id === id)
    },
    update(id: number, dto: BlogDto) {
        blogs.map(b => b.id === id ? {...b, dto} : b)
        return true
    },
    delete(id: number) {
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1)
                return true
            }
        }
        return false
    }
}