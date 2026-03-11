import {Request, Response, Router} from "express";
import {productsRepositories} from "../repositories/products.repositories";

export const productsRouter = Router({})

productsRouter.get('/', (req: Request, res: Response) => {
    const products = productsRepositories.findProducts(req.query.title ? req.query.title.toString() : null)
    res.send(products)

})
productsRouter.get('/:id', (req: Request, res: Response) => {
    let product = productsRepositories.getById(+req.params.id)
    if (!product) {
        res.send(404)
    }
    res.send(product)

})
productsRouter.delete('/:id', (req: Request, res: Response) => {
    const isDeleted = productsRepositories.deleteById(+req.params.id)
    if (!isDeleted) {
        res.send(404)
    }
    res.send(204)

})
productsRouter.post('/', (req: Request, res: Response) => {
    if (!req.body.title.trim()) {
        res.status(400).send({message: 'BAD REQ !'})
    }
    const product = productsRepositories.createProduct(req.body.title)
    if (!product) {
        res.sendStatus(404)
    }
    res.status(201).send(product)
})
productsRouter.put('/:id', (req: Request, res: Response) => {
    const product = productsRepositories.update(+req.params.id, req.body.title)
    if (!product) {
        res.send(404)
    } else {
        const product = productsRepositories.getById(+req.params.id)
        res.send(product)
    }
})
