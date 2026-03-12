import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {productsRouter} from "./routes/products.route";
import {setupApp} from "./set.app";
import {blogsRouter} from "./routes/blogs-router/blogs.router";
import {postsRouter} from "./routes/posts-router/posts.router";
import {SETTINGS} from "./settings";

const app = express()
setupApp(app)
const port = 3000

const bodyP = bodyParser({})

app.use(bodyP)

app.get('/', (req: Request, res: Response) => {
    res.send('Super !')
})
app.use('/products', productsRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)


app.listen(port, () => {
    console.log(`App was started on ${port}`)
})