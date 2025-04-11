// server/routes/productos.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los productos (ejemplo)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = router;
