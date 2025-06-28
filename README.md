# CryptoPay Backend

Este projeto é um backend em Node.js com Express e PostgreSQL para cadastro, autenticação de usuários e operações de carteira digital (saldo, depósito, transferência, pagamento e histórico de transações).

## Como rodar o backend

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

## Rotas principais do backend

- `POST /api/user/register` — Cadastro de usuário
- `POST /api/user/login` — Login de usuário
- `GET /api/saldo` — Consulta saldo
- `POST /api/deposito` — Depósito
- `POST /api/transferencia` — Transferência entre usuários
- `POST /api/pagamento` — Pagamento
- `GET /api/historico` — Histórico de transações

## Frontend

O frontend está na pasta `frontend/` e permite que o usuário interaja com todas as funcionalidades do sistema de carteira digital de forma visual e intuitiva.

### Estrutura dos arquivos:
- `frontend/index.html` — Página principal com telas de login, cadastro, saldo, transações, etc.
- `frontend/scripts.js` — Lógica de integração com o backend via fetch, manipulação de telas e formulários.
- `frontend/styles.css` — Estilos visuais da aplicação.

### Como usar o frontend
1. Com o backend rodando, abra o arquivo `frontend/index.html` no seu navegador.
2. Faça cadastro, login e utilize todas as funções (saldo, depósito, transferência, pagamento, histórico).
3. Todas as operações são integradas ao backend via API REST.

## Observações
- Use boas práticas de segurança: nunca exponha seu JWT_SECRET ou dados sensíveis.
- O projeto utiliza SQL seguro (prepared statements) para evitar SQL Injection.
- Não envie o arquivo `.env` nem a pasta `node_modules` para o repositório (use `.gitignore`).

## Requisitos
- Node.js
- PostgreSQL
- Navegador web para o frontend

---

Trabalho acadêmico — desenvolvido por Heliorocha1989.
