import { pool } from "./db.js";

export default function iniciaRotas(
  app,
) {
  // Buscar todos os motores
  app.get(
    "/api/motores",
    async (req, res) => {
      try {
        const [rows] = await pool.query(
          "SELECT * FROM motores",
        );
        res.status(200).json(rows);
      } catch (error) {
        console.error(
          "Erro ao buscar motores:",
          error,
        );
        res.status(500).json({
          error:
            "Erro interno ao consultar motores",
        });
      }
    },
  );

  app.post(
    "/api/motores",
    async (req, res) => {
      try {
        const {
          codigo,
          modelo,
          fabricante_id,
          potencia_cv,
          tensao,
          frequencia_hz,
          polos,
          rotacao_rpm,
          carcaca,
          grau_protecao,
          preco,
        } = req.body;

        const [resultado] =
          await pool.query(
            `INSERT INTO motores 
        (codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz, polos, rotacao_rpm, carcaca, grau_protecao, preco, criado_em) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              codigo,
              modelo,
              fabricante_id || null,
              potencia_cv,
              tensao,
              frequencia_hz || null,
              polos || null,
              rotacao_rpm,
              carcaca || null,
              grau_protecao || null,
              preco || null,
            ],
          );

        res.status(201).json({
          id: resultado.insertId,
          ...req.body,
        });
      } catch (error) {
        if (error.errno === 1062) {
          res.status(400).json({
            error:
              "Já existe um motor com esse código.",
          });
        } else {
          console.error(
            "Erro ao cadastrar motor:",
            error,
          );
          res.status(500).json({
            error:
              "Erro interno ao salvar motor",
          });
        }
      }
    },
  );

  // PUT: Atualizar motor existente por ID
  app.put(
    "/api/motores/:id",
    async (req, res) => {
      try {
        const { id } = req.params;
        const {
          codigo,
          modelo,
          fabricante_id,
          potencia_cv,
          tensao,
          frequencia_hz,
          polos,
          rotacao_rpm,
          carcaca,
          grau_protecao,
          preco,
        } = req.body;

        const querySql = `
      UPDATE motores 
      SET codigo = ?, 
          modelo = ?, 
          fabricante_id = ?, 
          potencia_cv = ?, 
          tensao = ?, 
          frequencia_hz = ?, 
          polos = ?, 
          rotacao_rpm = ?, 
          carcaca = ?, 
          grau_protecao = ?, 
          preco = ?
      WHERE id = ?
    `;

        const params = [
          codigo,
          modelo,
          fabricante_id || null,
          potencia_cv,
          tensao,
          frequencia_hz || null,
          polos || null,
          rotacao_rpm,
          carcaca || null,
          grau_protecao || null,
          preco || null,
          id,
        ];

        const [resultado] =
          await pool.query(
            querySql,
            params,
          );

        if (
          resultado.affectedRows === 0
        ) {
          return res
            .status(404)
            .json({
              error:
                "Motor não encontrado.",
            });
        }

        res
          .status(200)
          .json({
            id: Number(id),
            ...req.body,
          });
      } catch (error) {
        if (error.errno === 1062) {
          res
            .status(400)
            .json({
              error:
                "Já existe outro motor com esse código.",
            });
        } else {
          console.error(
            "Erro ao atualizar motor:",
            error,
          );
          res
            .status(500)
            .json({
              error:
                "Erro interno ao atualizar motor.",
            });
        }
      }
    },
  );
}
