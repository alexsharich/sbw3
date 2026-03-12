export type OutputBlogType = {
    id: string,
    name: string, // max 15
    description: string, // max 500
    websiteUrl: string, // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    /* createdAt:string,
     isMembership:boolean*/
}

export type InputBlogType = {
    name: string, // max 15
    description: string, // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}