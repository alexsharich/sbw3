import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {productsRouter} from "./routes/products.route";
import {setupApp} from "./set.app";

const app = express()
setupApp(app)
const port = 3000


const address = [{id: 1, value: 'Minsk'}, {id: 2, value: 'Moscow'}]
const bodyP = bodyParser({})

app.use(bodyP)

app.get('/', (req: Request, res: Response) => {
    res.send('Super !')
})
app.use('/products', productsRouter)


app.listen(port, () => {
    console.log(`App was started on ${port}`)
})