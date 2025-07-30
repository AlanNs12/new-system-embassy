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

router.use(authMiddleware); // todas as rotas daqui exigem login

router.post('/', funcionarioController.criar);
router.get('/', funcionarioController.listar);
router.put('/:id/desativar', funcionarioController.desativar);


module.exports = router;
