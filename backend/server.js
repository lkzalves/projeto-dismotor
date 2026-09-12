import express from 'express'
import cors from 'cors'
import iniciaRotas from './routes.js'


const app = express()
app.use(cors());
app.use(express.json())

iniciaRotas(app)

app.listen(3000, () => {
    console.log('Servidor Rorando')
})

export default app