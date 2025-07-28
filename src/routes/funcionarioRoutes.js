const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas para funcionários
router.post('/', authMiddleware, funcionarioController.create);
router.get('/', authMiddleware, funcionarioController.getAll);
router.get('/:id', authMiddleware, funcionarioController.getById);
router.put('/:id', authMiddleware, funcionarioController.update);
router.delete('/:id', authMiddleware, funcionarioController.delete);

module.exports = router;
