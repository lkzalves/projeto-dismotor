import { pool } from './db.js'

export default function iniciaRotas(app) {
  // Buscar todos os motores
  app.get('/motores', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM motores')
      res.status(200).json(rows)
    } catch (error) {
      console.error('Erro ao buscar motores:', error)
      res.status(500).json({ error: 'Erro interno ao consultar motores' })
    }
  })

  app.post('/motores', async (req, res) => {
    try {
        const {codigo, modelo, fabricante_id,potencia_cv,tensao,frequencia_hz,polos,rotacao_rpm,carcaca,grau_protecao,preco,criado_em} = req.body
        const [resultado] = await pool.query('INSERT INTO motores (codigo, modelo, fabricante_id,potencia_cv,tensao,frequencia_hz,polos,rotacao_rpm,carcaca,grau_protecao,preco,criado_em) VALUES (?,?,?,?,?,?,?,?,?,?,?,NOW())', [codigo, modelo, fabricante_id,potencia_cv,tensao,frequencia_hz,polos,rotacao_rpm,carcaca,grau_protecao,preco,criado_em])
        res.status(201).json({ id: resultado.insertId, ...req.body })
    } catch (error) {
        if(error.errno === 1062){
            res.status(400).json({ error: 'Já existe um motor com esse código.' })
        }else{
            console.error('Erro ao cadastrar motor:', error)
            res.status(500).json({ error: 'Erro interno ao salvar motor' })
        }
        
    }
  })

}
