import express, {Express} from 'express'
import {SETTINGS} from "./settings";
import {Request, Response} from "express";

import {postsRouter} from "./routes/posts-router/posts.router";
import {blogsRouter} from "./routes/blogs-router/blogs.router";
import {testingRouter} from "./routes/testing/testing.router";


export const setupApp = async (app: Express) => {
    app.use(express.json());
    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({version: '1.0'})
    })
    app.use(SETTINGS.PATH.POSTS, postsRouter)
    app.use(SETTINGS.PATH.BLOGS, blogsRouter)
    app.use(SETTINGS.PATH.TESTING,testingRouter)

    return app;
};