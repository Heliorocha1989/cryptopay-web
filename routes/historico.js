const express = require('express');
const pool = require('../db');
const router = express.Router();

// Histórico de transações do usuário
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT tipo, valor, destino, data FROM transactions WHERE user_id = $1 ORDER BY data DESC',
      [id]
    );
    res.json({ historico: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar histórico.' });
  }
});

module.exports = router;
