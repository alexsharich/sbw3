import {config} from "dotenv";

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        AUTH: '/auth',
        COMMENTS: '/comments',
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        TESTING: '/testing',
        DEVICES: '/security'
    },
    ADMIN_AUTH: 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL,
    JWT_ACCESS: process.env.JWT_ACCESS_SECRET || '111',
    JWT_REFRESH: process.env.JWT_REFRESH_SECRET || '333'
}