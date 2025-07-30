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

router.use(authMiddleware);

router.post('/entrada', registroController.registrarEntrada);
router.post('/saida', registroController.registrarSaida);
router.get('/', registroController.listar); // opcional: para testar


module.exports = router;
