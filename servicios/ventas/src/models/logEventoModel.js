// models/logEventoModel.js
import pool from "../database.js";

export const createLogEvento = async ({ usuario_id, accion, ip_origen }) => {
  const query = `
    INSERT INTO LOG_EVENTO (usuario_id, fecha_hora, accion, ip_origen)
    VALUES ($1, NOW(), $2, $3)
    RETURNING *
  `;
  const values = [usuario_id, accion, ip_origen || null];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export default { createLogEvento };
