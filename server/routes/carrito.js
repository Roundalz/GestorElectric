// server/routes/carrito.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los registros del carrito
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM carrito');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).send('Error al obtener el carrito');
  }
});

// Obtener productos por código de carrito
/*router.get('/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.nombre, p.precio, pc.cantidad
       FROM productos_carrito pc
       JOIN productos p ON pc.id_producto = p.id_producto
       WHERE pc.codigo_carrito = $1`,
      [codigo]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos del carrito:', err);
    res.status(500).send('Error al obtener productos');
  }
});*/

module.exports = router;
