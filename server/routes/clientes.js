// server/routes/clientes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cliente');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    res.status(500).send('Error al obtener clientes');
  }
});

module.exports = router;
