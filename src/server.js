const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const registroRoutes = require('./routes/registroRoutes');
const funcionariosRoutes = require('./routes/funcionarios');

const app = express();
app.use(cors());
app.use(express.json())


//Rotas


app.use('/api/auth', authRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/registros', registroRoutes);
app.use('/funcionarios', funcionariosRoutes);


//Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor FUncionando e conectado ao Banco de Dados!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});