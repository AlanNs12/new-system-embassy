const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // todas as rotas daqui exigem login

router.post('/', funcionarioController.criar);
router.get('/', funcionarioController.listar);
router.put('/:id/desativar', funcionarioController.desativar);

module.exports = router;
