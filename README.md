# 📌 Sistema de Controle de Entrada e Saída de Funcionários

Este projeto é um sistema de controle de ponto de funcionários, feito em **Node.js** com **PostgreSQL**.  
Permite registrar entradas e saídas, gerar relatórios em PDF, gerenciar funcionários e usuários (admin e comuns).

---

## ✅ **Pré-requisitos**

- **Node.js** instalado (>= 18.x)
- **PostgreSQL** acessível (banco remoto ou local)
- Um editor de texto (VS Code recomendado)

---

## 📂 **Estrutura do Projeto**

```
controle-funcionarios/
│
├─ src/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ funcionarioController.js
│  │  └─ registroController.js
│  ├─ middleware/
│  │  └─ authMiddleware.js
│  ├─ models/
│  │  ├─ Usuario.js
│  │  ├─ Funcionario.js
│  │  └─ Registro.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ funcionarioRoutes.js
│  │  └─ registroRoutes.js
│  ├─ utils/
│  │  └─ gerarPDF.js
│  ├─ server.js
│
├─ public/
│  ├─ index.html
│  ├─ dashboard.html
│  └─ ...
│
├─ .env
├─ package.json
└─ README.md
```

---

## ⚙️ **Configuração do Banco de Dados**

Crie o banco no seu Postgres e execute os seguintes scripts:

```sql
-- Tabela de usuários (quem faz login no sistema)
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'user',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de funcionários (quem será controlado)
CREATE TABLE funcionarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  funcao VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de registros (entrada e saída)
CREATE TABLE registros (
  id SERIAL PRIMARY KEY,
  funcionario_id INT NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  hora_entrada TIME,
  hora_saida TIME,
  observacao TEXT,
  registrado_por INT REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📦 **Dependências instaladas**

```bash
npm install express pg bcryptjs jsonwebtoken cors dotenv pdfkit
npm install --save-dev nodemon
```

---

## 🔑 **Configurar variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```
DATABASE_URL=postgres://usuario:senha@host:porta/nome_do_banco
JWT_SECRET=sua_chave_secreta
PORT=3000
```

---

## ▶️ **Rodando o sistema localmente**

1. Clone o repositório:
   ```bash
   git clone https://seurepositorio.git
   cd controle-funcionarios
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   Ou para rodar sem nodemon:
   ```bash
   npm start
   ```

4. Acesse no navegador:
   ```
   http://localhost:3000
   ```

---

## 🔧 **Principais rotas**

- `POST /api/auth/register` → cadastrar novo usuário
- `POST /api/auth/login` → login de usuário (retorna token)
- `POST /api/funcionarios` → cadastrar funcionário (rota protegida)
- `POST /api/registros/entrada` → registrar entrada (rota protegida)
- `POST /api/registros/saida` → registrar saída (rota protegida)

---

## 📄 **Relatórios**

- Os registros podem ser exportados em PDF utilizando a rota (a ser implementada) `/api/registros/relatorio?inicio=YYYY-MM-DD&fim=YYYY-MM-DD`.
- O layout do PDF segue o modelo tradicional de planilha (colunas: Date | IN | OUT | OBS).

---

## 👨‍💻 **Usuários Admin**

- Usuário do tipo `admin` pode:
  - Cadastrar/editar/excluir outros usuários
  - Arquivar registros
  - Gerenciar funcionários

---

**Feito para ser simples de manter e direto ao ponto.**
