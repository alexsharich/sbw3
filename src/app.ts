import express, {Request, Response} from "express";
import {productsRouter} from "./routes/products.route";
import {SETTINGS} from "./settings";
import {blogsRouter} from "./routes/blogs-router/blogs.router";
import {postsRouter} from "./routes/posts-router/posts.router";
import bodyParser from "body-parser";
import {setupApp} from "./set.app";


export const app = express()
const bodyP = bodyParser({})
setupApp(app)

app.use(bodyP)
app.get('/', (req: Request, res: Response) => {
    res.send('Super !')
})
app.use('/products', productsRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)