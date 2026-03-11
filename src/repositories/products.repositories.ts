let products = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}]

export const productsRepositories = {
    findProducts(title: string | null | undefined) {
        if (title) {
            let search = title.toString()
            return products.filter(p => p.title.indexOf(search) > -1)
        } else {
            return products
        }
    },
    createProduct(title: string) {
        const product = {
            id: +(new Date()),
            title: title
        }
        products.push(product)
        return product
    },
    getById(id: number) {
        const product = products.find(p => p.id === id)
        return product
    },
    update(id: number, title: string) {
        const product = products.find(p => p.id === id)
        if (product) {
            product.title = title
            return true
        }
        return false

    },
    deleteById(id: number) {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products.splice(i, 1)
                return true
            }
        }
        return false
    }
}