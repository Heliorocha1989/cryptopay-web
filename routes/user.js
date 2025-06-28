const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Cadastro de usuário
router.post('/register', async (req, res) => {
  const { id, username, bankCode } = req.body;
  if (!id || !username || !bankCode) {
    return res.status(400).json({ error: 'ID, nome e código do banco são obrigatórios.' });
  }
  try {
    await pool.query('INSERT INTO users (id, username, bank_code) VALUES ($1, $2, $3)', [id, username, bankCode]);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'ID já existe.' });
    } else {
      res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { id, username, bankCode } = req.body;
  if (!id || !username || !bankCode) {
    return res.status(400).json({ error: 'ID, nome e código do banco são obrigatórios.' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND username = $2 AND bank_code = $3', [id, username, bankCode]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Dados inválidos.' });
    }
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username, bankCode: user.bank_code }, process.env.JWT_SECRET || 'segredo', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

module.exports = router;
