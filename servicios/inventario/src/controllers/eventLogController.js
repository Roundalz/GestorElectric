import pool from "../database.js";

/**
 * Controlador para rutas relacionadas con la tabla LOG_EVENTO.
 */

/**
 * GET /logs
 * Obtiene todos los registros de log, opcionalmente filtrando por tabla.
 */
export async function getAllLogs(req, res) {
  try {
    const { tabla } = req.query;
    let queryText = `SELECT id_logevento AS id, usuario_id, fecha_hora, accion AS descripcion, ip_origen FROM LOG_EVENTO`;
    const values = [];
    if (tabla) {
      queryText += ` WHERE accion ILIKE '%' || $1 || '%'`;
      values.push(tabla);
    }
    queryText += ` ORDER BY fecha_hora DESC`;
    const { rows } = await pool.query(queryText, values);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en getAllLogs:", error);
    return res.status(500).json({ error: "Error al obtener logs" });
  }
}

/**
 * GET /logs/:id
 * Obtiene un registro de log por su ID.
 */
export async function getLogById(req, res) {
  try {
    const id = Number(req.params.id);
    const queryText = `
      SELECT id_logevento AS id, usuario_id, fecha_hora, accion AS descripcion, ip_origen
        FROM LOG_EVENTO
       WHERE id_logevento = $1
    `;
    const { rows } = await pool.query(queryText, [id]);
    if (!rows.length) {
      return res.status(404).json({ error: "Log no encontrado" });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error en getLogById:", error);
    return res.status(500).json({ error: "Error al obtener el log" });
  }
}

export default {
  getAllLogs,
  getLogById
};