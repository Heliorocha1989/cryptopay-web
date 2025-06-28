# CryptoPay Backend

Este projeto é um backend em Node.js com Express e PostgreSQL para cadastro e autenticação de usuários.

## Como rodar

1. Instale as dependências:
   ```
   npm install
   ```
2. Configure o arquivo `.env` com as variáveis:
   - DATABASE_URL=postgresql://usuario:senha@localhost:5432/cryptopay
   - JWT_SECRET=umsegurosegredo
3. Crie a tabela executando o script `schema.sql` no seu banco PostgreSQL.
4. Inicie o servidor:
   ```
   node index.js
   ```

## Rotas principais
- POST `/api/user/register` — Cadastro de usuário
- POST `/api/user/login` — Login de usuário
