// orquestador/src/controllers/servicioController.js
import pool from '../database.js';

// Obtener todos los servicios
export const getServicios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SERVICIO ORDER BY codigo_servicio ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener servicios:", err);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

// Obtener un servicio por ID (codigo_servicio)
export const getServicioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM SERVICIO WHERE codigo_servicio = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener servicio:", err);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
};

// Crear un nuevo servicio
export const createServicio = async (req, res) => {
  // Ahora se espera que codigo_servicio se envíe en el cuerpo de la solicitud
  const { codigo_servicio, nombre_servicio, costo_servicio, descripcion_servicio } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO SERVICIO (codigo_servicio, nombre_servicio, costo_servicio, descripcion_servicio) VALUES ($1, $2, $3, $4) RETURNING *',
      [codigo_servicio, nombre_servicio, costo_servicio, descripcion_servicio]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear servicio:", err);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

// Actualizar un servicio existente
export const updateServicio = async (req, res) => {
  const { id } = req.params;
  const { nombre_servicio, costo_servicio, descripcion_servicio } = req.body;
  try {
    const result = await pool.query(
      'UPDATE SERVICIO SET nombre_servicio = $1, costo_servicio = $2, descripcion_servicio = $3 WHERE codigo_servicio = $4 RETURNING *',
      [nombre_servicio, costo_servicio, descripcion_servicio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar servicio:", err);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

// Eliminar un servicio
export const deleteServicio = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM SERVICIO WHERE codigo_servicio = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio eliminado' });
  } catch (err) {
    console.error("Error al eliminar servicio:", err);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};
