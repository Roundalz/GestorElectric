// orquestador/src/controllers/clienteController.js
import pool from '../database.js';

// Obtener todos los portales
export const getPortal = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PORTAL ORDER BY codigo_portal ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener portales:", err);
    res.status(500).json({ error: 'Error al obtener portales' });
  }
};

// Obtener un portal por ID (codigo_cliente)
export const getPortalById = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM PORTAL WHERE codigo_portal = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Portal no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error al obtener portal:", err);
      res.status(500).json({ error: 'Error al obtener portal' });
    }
};

