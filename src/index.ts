const express = require('express')
const app = express()
const port = 3000

app.get('/', (req: any, res: any) => {
    res.send('Super !')
})

app.listen(port, () => {
    console.log(`App was started on ${port}`)
})