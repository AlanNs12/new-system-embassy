const pool = require('../config/db');

module.exports = {
  // Cadastrar funcionário
  async criar(req, res) {
    try {
      const { nome, funcao } = req.body;
      if (!nome || !funcao) {
        return res.status(400).json({ message: 'Nome e função são obrigatórios' });
      }

      const result = await pool.query(
        'INSERT INTO funcionarios (nome, funcao) VALUES ($1, $2) RETURNING id',
        [nome, funcao]
      );

      res.status(201).json({ message: 'Funcionário cadastrado', id: result.rows[0].id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao cadastrar funcionário' });
    }
  },

  // Listar funcionários
  async listar(req, res) {
    try {
      const result = await pool.query('SELECT * FROM funcionarios WHERE ativo = TRUE ORDER BY nome');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar funcionários' });
    }
  },

  // Opcional: desativar funcionário
  async desativar(req, res) {
    try {
      const { id } = req.params;
      await pool.query('UPDATE funcionarios SET ativo = FALSE WHERE id = $1', [id]);
      res.json({ message: 'Funcionário desativado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao desativar funcionário' });
    }
  }
};
