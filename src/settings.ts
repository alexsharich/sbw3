import {config} from "dotenv";

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing'
    },
    ADMIN_AUTH: 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL
}