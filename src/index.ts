import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {productsRouter} from "./routes/products.route";
import {setupApp} from "./set.app";
import {blogsRouter} from "./routes/blogs-router/blogs.router";
import {postsRouter} from "./routes/posts-router/posts.router";
import {SETTINGS} from "./settings";
import {runDb} from "./repositories/db/db";
import {app} from "./app";


const startApp = async () => {
    await runDb()

    app.listen(SETTINGS.PORT, () => {
        console.log(`App was started on ${SETTINGS.PORT}`)
    })
    app.set('trust proxy', true)
}
startApp()