import pool from "../database.js";

// Función para registrar logs
export const registrarLog = async ({ usuario_id, accion, ip_origen }) => {
  try {
    await pool.query(
      `INSERT INTO LOG_EVENTO (usuario_id, fecha_hora, accion, ip_origen) 
       VALUES ($1, CURRENT_TIMESTAMP, $2, $3)`,
      [usuario_id, accion, ip_origen]
    );
  } catch (error) {
    console.error("Error al registrar log:", error.message);
  }
};

// Función para obtener logs
export const obtenerLogs = async (req, res) => {
  try {
    const logs = await pool.query("SELECT * FROM LOG_EVENTO");
    res.json(logs.rows);
  } catch (error) {
    console.error("Error al obtener logs:", error.message);
    res.status(500).json({ error: "Error al obtener logs" });
  }
};