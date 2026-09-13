import { pool } from "./db.js";

export default function iniciaRotas(
  app,
) {
  app.get(
    "/api/health",
    async (req, res) => {
      try {
        await pool.query("SELECT 1");
        res
          .status(200)
          .json({
            status: "ok",
            database: "ok",
          });
      } catch (error) {
        res
          .status(500)
          .json({
            status: "error",
            database: "down",
          });
      }
    },
  );

  app.get(
    "/api/motores",
    async (req, res) => {
      try {
        const { search } = req.query;
        let query =
          "SELECT * FROM motores";
        let params = [];

        if (
          search &&
          search.trim() !== ""
        ) {
          query +=
            " WHERE codigo LIKE ? OR modelo LIKE ?";
          const termo = `%${search.trim()}%`;
          params = [termo, termo];
        }

        query += " ORDER BY id DESC";

        const [rows] = await pool.query(
          query,
          params,
        );
        res.status(200).json(rows);
      } catch (error) {
        console.error(
          "Erro ao buscar motores:",
          error,
        );
        res
          .status(500)
          .json({
            error:
              "Erro interno ao consultar motores",
          });
      }
    },
  );

  app.get(
    "/api/motores/:id",
    async (req, res) => {
      try {
        const { id } = req.params;
        const [rows] = await pool.query(
          "SELECT * FROM motores WHERE id = ?",
          [id],
        );

        if (rows.length === 0) {
          return res
            .status(404)
            .json({
              error:
                "Motor não encontrado",
            });
        }

        res.status(200).json(rows[0]);
      } catch (error) {
        res
          .status(500)
          .json({
            error:
              "Erro interno ao buscar motor",
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

        const details = [];
        if (!codigo)
          details.push(
            "codigo é obrigatório",
          );
        if (!modelo)
          details.push(
            "modelo é obrigatório",
          );
        if (!fabricante_id)
          details.push(
            "fabricante_id é obrigatório",
          );
        if (potencia_cv <= 0)
          details.push(
            "potencia_cv deve ser maior que zero",
          );
        if (
          ![50, 60].includes(
            Number(frequencia_hz),
          )
        )
          details.push(
            "frequencia_hz deve ser 50 ou 60",
          );
        if (
          ![2, 4, 6, 8].includes(
            Number(polos),
          )
        )
          details.push(
            "polos deve ser 2, 4, 6 ou 8",
          );

        if (details.length > 0) {
          return res
            .status(400)
            .json({
              error: "Dados inválidos",
              details,
            });
        }

        const [resultado] =
          await pool.query(
            `INSERT INTO motores 
        (codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz, polos, rotacao_rpm, carcaca, grau_protecao, preco, criado_em) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              codigo,
              modelo,
              fabricante_id,
              potencia_cv,
              tensao,
              frequencia_hz,
              polos,
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
          res.status(409).json({
            error:
              "Código já cadastrado",
            details: [
              "Já existe um motor cadastrado com este código.",
            ],
          });
        } else {
          console.error(
            "Erro ao cadastrar motor:",
            error,
          );
          res
            .status(500)
            .json({
              error:
                "Erro interno ao salvar motor",
            });
        }
      }
    },
  );

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
          fabricante_id,
          potencia_cv,
          tensao,
          frequencia_hz,
          polos,
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

        res.status(200).json({
          id: Number(id),
          ...req.body,
        });
      } catch (error) {
        if (error.errno === 1062) {
          res.status(409).json({
            error:
              "Código já cadastrado",
            details: [
              "Já existe outro motor com esse código.",
            ],
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

  app.delete(
    "/api/motores/:id",
    async (req, res) => {
      try {
        const { id } = req.params;

        const [resultado] =
          await pool.query(
            "DELETE FROM motores WHERE id = ?",
            [id],
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
            message:
              "Motor excluído com sucesso.",
          });
      } catch (error) {
        console.error(
          "Erro ao excluir motor:",
          error,
        );
        res
          .status(500)
          .json({
            error:
              "Erro interno ao excluir motor.",
          });
      }
    },
  );
}
