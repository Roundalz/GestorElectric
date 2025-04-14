// orquestador/src/controllers/servicioController.js
import pool from '../database.js';

// Obtener todos los servicios
export const getProducto = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PRODUCTOS ORDER BY codigo_producto ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un servicio por ID (codigo_servicio)
export const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM PRODUCTOS WHERE codigo_producto = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};
