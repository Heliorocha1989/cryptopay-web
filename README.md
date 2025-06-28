# CryptoPay Backend

Este projeto é um backend em Node.js com Express e PostgreSQL para cadastro, autenticação de usuários e operações de carteira digital (saldo, depósito, transferência, pagamento e histórico de transações).

## Como rodar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o arquivo `.env`** com as variáveis de ambiente:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/cryptopay
   JWT_SECRET=umsegurosegredo
   ```
   (Renomeie `.env.example` para `.env` e ajuste os valores conforme seu ambiente)

3. **Crie as tabelas no banco PostgreSQL:**
   Execute o script `schema.sql` no seu banco de dados para criar as tabelas necessárias.

4. **Inicie o servidor:**
   ```bash
   node index.js
   ```

## Rotas principais

- `POST /api/user/register` — Cadastro de usuário
- `POST /api/user/login` — Login de usuário
- `GET /api/saldo` — Consulta saldo
- `POST /api/deposito` — Depósito
- `POST /api/transferencia` — Transferência entre usuários
- `POST /api/pagamento` — Pagamento
- `GET /api/historico` — Histórico de transações

## Observações
- Use boas práticas de segurança: nunca exponha seu JWT_SECRET ou dados sensíveis.
- O projeto utiliza SQL seguro (prepared statements) para evitar SQL Injection.
- Não envie o arquivo `.env` nem a pasta `node_modules` para o repositório (use `.gitignore`).

## Requisitos
- Node.js
- PostgreSQL

---

Trabalho acadêmico — desenvolvido por Heliorocha1989.
