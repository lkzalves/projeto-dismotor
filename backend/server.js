import express from 'express'
import iniciaRotas from './routes.js'

const app = express()
app.use(express.json())

iniciaRotas(app)

app.listen(3000, () => {
    console.log('Servidor Rorando')
})

export default app