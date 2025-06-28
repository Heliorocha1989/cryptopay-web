const express = require('express');
const pool = require('../db');
const router = express.Router();

// Consulta saldo do usuário
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT saldo FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ id, saldo: result.rows[0].saldo });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar saldo.' });
  }
});

module.exports = router;
