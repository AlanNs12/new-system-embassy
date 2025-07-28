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
};
