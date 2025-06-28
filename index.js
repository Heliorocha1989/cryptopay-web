require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user');
const saldoRoutes = require('./routes/saldo');
const transacaoRoutes = require('./routes/transacao');
const historicoRoutes = require('./routes/historico');

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/saldo', saldoRoutes);
app.use('/api/transacao', transacaoRoutes);
app.use('/api/historico', historicoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
