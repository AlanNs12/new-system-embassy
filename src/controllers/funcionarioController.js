const pool = require('../config/db');

module.exports = {
<<<<<<< feature/implement-routes
    async create(req, res) {
        try {
            const { nome, cargo, horario_trabalho } = req.body;
            const result = await pool.query(
                'INSERT INTO funcionarios (nome, cargo, horario_trabalho) VALUES ($1, $2, $3) RETURNING *',
                [nome, cargo, horario_trabalho]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao criar funcionário' });
        }
    },

    async getAll(req, res) {
        try {
            const result = await pool.query('SELECT * FROM funcionarios');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar funcionários' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM funcionarios WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar funcionário' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, cargo, horario_trabalho } = req.body;
            const result = await pool.query(
                'UPDATE funcionarios SET nome = $1, cargo = $2, horario_trabalho = $3 WHERE id = $4 RETURNING *',
                [nome, cargo, horario_trabalho, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao atualizar funcionário' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query('DELETE FROM funcionarios WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
            res.json({ message: 'Funcionário deletado com sucesso' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro ao deletar funcionário' });
        }
    }

};
