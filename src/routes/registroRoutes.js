const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas para registros de ponto
router.post('/', authMiddleware, registroController.create);
router.get('/', authMiddleware, registroController.getAll);
router.get('/:id', authMiddleware, registroController.getById);
router.put('/:id', authMiddleware, registroController.update);
router.delete('/:id', authMiddleware, registroController.delete);
router.get('/funcionario/:id', authMiddleware, registroController.getByFuncionarioId);
router.get('/pdf/:mes/:ano', authMiddleware, registroController.gerarPDF);

module.exports = router;
