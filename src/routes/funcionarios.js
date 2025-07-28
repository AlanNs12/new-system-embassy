const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const autenticar = require('../middlewares/authMiddleware');

// Listar todos os funcionários ativos
router.get('/', autenticar, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM funcionarios WHERE ativo = TRUE ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar funcionários:', err);
    res.status(500).json({ erro: 'Erro ao listar funcionários' });
  }
});

// Cadastrar novo funcionário
router.post('/', autenticar, async (req, res) => {
  const { nome, funcao } = req.body;
  if (!nome || !funcao) return res.status(400).json({ erro: 'Nome e função são obrigatórios' });

  try {
    const result = await pool.query(
      'INSERT INTO funcionarios (nome, funcao) VALUES ($1, $2) RETURNING *',
      [nome, funcao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao cadastrar funcionário:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
  }
});

// Atualizar funcionário
router.put('/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  const { nome, funcao } = req.body;

  try {
    const result = await pool.query(
      'UPDATE funcionarios SET nome = $1, funcao = $2 WHERE id = $3 RETURNING *',
      [nome, funcao, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    res.status(500).json({ erro: 'Erro ao atualizar funcionário' });
  }
});

// Desativar funcionário (soft delete)
router.delete('/:id', autenticar, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE funcionarios SET ativo = FALSE WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
    res.json({ mensagem: 'Funcionário desativado com sucesso' });
  } catch (err) {
    console.error('Erro ao desativar funcionário:', err);
    res.status(500).json({ erro: 'Erro ao desativar funcionário' });
  }
});

module.exports = router;
