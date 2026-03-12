export type OutputPostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type InputPostType = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
}

export type InputPostForBlogType = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
}