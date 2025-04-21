import pool from "../database.js";

export const registrarEvento = async (usuarioId, accion, ipOrigen = null) => {
  try {
    await pool.query(
      "INSERT INTO LOG_EVENTO (usuario_id, fecha_hora, accion, ip_origen) VALUES ($1, CURRENT_TIMESTAMP, $2, $3)",
      [usuarioId, accion, ipOrigen]
    );
  } catch (error) {
    console.error("Error al registrar evento:", error);
  }
};
