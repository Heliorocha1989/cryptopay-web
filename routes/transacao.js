const express = require('express');
const pool = require('../db');
const router = express.Router();

// Depositar saldo
router.post('/depositar', async (req, res) => {
  const { id, valor } = req.body;
  if (!id || !valor || valor <= 0) {
    return res.status(400).json({ error: 'ID e valor válido são obrigatórios.' });
  }
  try {
    await pool.query('UPDATE users SET saldo = saldo + $1 WHERE id = $2', [valor, id]);
    await pool.query('INSERT INTO transactions (user_id, tipo, valor) VALUES ($1, $2, $3)', [id, 'deposito', valor]);
    res.json({ message: 'Depósito realizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao depositar.' });
  }
});

// Transferir saldo
router.post('/transferir', async (req, res) => {
  const { idOrigem, idDestino, valor } = req.body;
  if (!idOrigem || !idDestino || !valor || valor <= 0) {
    return res.status(400).json({ error: 'IDs e valor válido são obrigatórios.' });
  }
  try {
    // Verifica saldo suficiente
    const result = await pool.query('SELECT saldo FROM users WHERE id = $1', [idOrigem]);
    if (result.rows.length === 0 || parseFloat(result.rows[0].saldo) < valor) {
      return res.status(400).json({ error: 'Saldo insuficiente ou usuário não encontrado.' });
    }
    // Transação atômica
    await pool.query('BEGIN');
    await pool.query('UPDATE users SET saldo = saldo - $1 WHERE id = $2', [valor, idOrigem]);
    await pool.query('UPDATE users SET saldo = saldo + $1 WHERE id = $2', [valor, idDestino]);
    await pool.query('INSERT INTO transactions (user_id, tipo, valor, destino) VALUES ($1, $2, $3, $4)', [idOrigem, 'transferencia', valor, idDestino]);
    await pool.query('COMMIT');
    res.json({ message: 'Transferência realizada com sucesso!' });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Erro ao transferir.' });
  }
});

// Simular pagamento
router.post('/pagar', async (req, res) => {
  const { id, valor, destino } = req.body;
  if (!id || !valor || valor <= 0) {
    return res.status(400).json({ error: 'ID e valor válido são obrigatórios.' });
  }
  try {
    // Verifica saldo suficiente
    const result = await pool.query('SELECT saldo FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0 || parseFloat(result.rows[0].saldo) < valor) {
      return res.status(400).json({ error: 'Saldo insuficiente ou usuário não encontrado.' });
    }
    // Atualiza saldo e registra pagamento
    await pool.query('BEGIN');
    await pool.query('UPDATE users SET saldo = saldo - $1 WHERE id = $2', [valor, id]);
    await pool.query('INSERT INTO transactions (user_id, tipo, valor, destino) VALUES ($1, $2, $3, $4)', [id, 'pagamento', valor, destino || null]);
    await pool.query('COMMIT');
    res.json({ message: 'Pagamento simulado com sucesso!' });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Erro ao simular pagamento.' });
  }
});

module.exports = router;
