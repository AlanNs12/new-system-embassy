const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/entrada', registroController.registrarEntrada);
router.post('/saida', registroController.registrarSaida);
router.get('/', registroController.listar); // opcional: para testar

module.exports = router;
