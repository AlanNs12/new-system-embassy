const pool = require('../config/db');
const gerarPDF = require('../utils/gerarPDF');

module.exports = {
    async create(req, res) {
        try {
            const { funcionario_id, tipo, data_hora } = req.body;
            const result = await pool.query(
                'INSERT INTO registros_ponto (funcionario_id, tipo, data_hora) VALUES ($1, $2, $3) RETURNING *',
                [funcionario_id, tipo, data_hora]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao criar registro de ponto' });
        }
    },

    async getAll(req, res) {
        try {
            const result = await pool.query('SELECT * FROM registros_ponto');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar registros de ponto' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM registros_ponto WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Registro de ponto não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar registro de ponto' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { funcionario_id, tipo, data_hora } = req.body;
            const result = await pool.query(
                'UPDATE registros_ponto SET funcionario_id = $1, tipo = $2, data_hora = $3 WHERE id = $4 RETURNING *',
                [funcionario_id, tipo, data_hora, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Registro de ponto não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao atualizar registro de ponto' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query('DELETE FROM registros_ponto WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Registro de ponto não encontrado' });
            }
            res.json({ message: 'Registro de ponto deletado com sucesso' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao deletar registro de ponto' });
        }
    },

    async getByFuncionarioId(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM registros_ponto WHERE funcionario_id = $1', [id]);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar registros de ponto por funcionário' });
        }
    },

    async gerarPDF(req, res) {
        try {
            const { mes, ano } = req.params;
            const result = await pool.query(
                'SELECT * FROM registros_ponto WHERE EXTRACT(MONTH FROM data_hora) = $1 AND EXTRACT(YEAR FROM data_hora) = $2',
                [mes, ano]
            );
            const registros = result.rows;
            const pdf = await gerarPDF(registros);
            res.contentType('application/pdf');
            res.send(pdf);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao gerar PDF' });
        }
    }
=======

module.exports = {
  // Registrar entrada
  async registrarEntrada(req, res) {
    const { funcionario_id, observacao } = req.body;
    const usuario_id = req.user.id;

    try {
      // Verifica se já existe entrada sem saída hoje
      const check = await pool.query(
        `SELECT * FROM registros
         WHERE funcionario_id = $1 AND hora_saida IS NULL AND data = CURRENT_DATE`,
        [funcionario_id]
      );

      if (check.rows.length > 0) {
        return res.status(400).json({ message: 'Funcionário já tem entrada registrada sem saída.' });
      }

      await pool.query(
        `INSERT INTO registros (funcionario_id, hora_entrada, observacao, registrado_por)
         VALUES ($1, CURRENT_TIME, $2, $3)`,
        [funcionario_id, observacao || '', usuario_id]
      );

      res.status(201).json({ message: 'Entrada registrada com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao registrar entrada.' });
    }
  },

  // Registrar saída
  async registrarSaida(req, res) {
    const { funcionario_id } = req.body;

    try {
      // Busca o último registro sem saída
      const result = await pool.query(
        `SELECT * FROM registros
         WHERE funcionario_id = $1 AND hora_saida IS NULL AND data = CURRENT_DATE
         ORDER BY id DESC LIMIT 1`,
        [funcionario_id]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Nenhuma entrada pendente encontrada.' });
      }

      const registro_id = result.rows[0].id;

      await pool.query(
        `UPDATE registros SET hora_saida = CURRENT_TIME WHERE id = $1`,
        [registro_id]
      );

      res.json({ message: 'Saída registrada com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao registrar saída.' });
    }
  },

  // Listar registros (para teste)
  async listar(req, res) {
    try {
      const result = await pool.query(`
        SELECT r.id, f.nome, f.funcao, r.data, r.hora_entrada, r.hora_saida, r.observacao
        FROM registros r
        JOIN funcionarios f ON r.funcionario_id = f.id
        ORDER BY r.data DESC, r.hora_entrada DESC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar registros' });
    }
  }
};
