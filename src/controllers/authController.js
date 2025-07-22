const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    //cadastro de usuarios
    async register(req, res){
        try{
            const {nome, senha, tipo} = req.body;
            if (!nome || !senha) {
                return res.status(400).json({message: 'Nome e senha são obrigatorios'});
            }
            const hash = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (nome, senha, tipo) VALUES ($1, $2,$3) RETURNING id' [nome, hash, tipo || 'user'] 
        );
        res.status(201).json({message: 'Usuario Criado', id: result.rows[0].id});
        } catch (err) {
            console.error(err);
            res.status(500).json({message: 'Erro ao criar usuario'});
        }  
    },

    // login 
    async login(req, res) {
        try {
            const {nome, senha} = req.body;
            const result = await pool.query('SELECT * FROM usuarios WHERE nome=$1', [nome]);

            if (result.rows.length === 0){
                return res.status(401).json({message: 'Usuario ou senha incorretos'});
            }
            const user = result.rows[0];
            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return res.status(401).json({message: 'Senha incorreta'});
            }
            const token = jwt.sign(
                {id: user.id, nome: user.nome, tipo: user.tipo},
                process.env.JWT_SECRET,
                {expiresIn: '12h'}
            );

            res.json({token, tipo: user.tipo});
        } catch (err) {
            console.error(err);
            res.status(500).json({message: 'Erro ao fazer login'});
        }
    },
};