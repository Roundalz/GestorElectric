import pool from "../database.js";
// GET
export const obtenerLogs = async (req, res) => {
  try {
    // Obtener logs de LOG_EVENTO
    const [eventos] = await db.query(`
      SELECT 
        id_logEvento AS id,
        accion,
        usuario_id AS usuario,
        fecha_hora AS fecha,
        ip_origen AS detalles,
        'evento' AS tipo_log
      FROM LOG_EVENTO
    `);

    // Obtener logs de LOG_USUARIO
    const [usuarios] = await db.query(`
      SELECT 
        col_logUsuario AS id,
        'Login/Logout' AS accion,
        usuario_id AS usuario,
        fecha_hora AS fecha,
        ip_origen AS detalles,
        'usuario' AS tipo_log
      FROM LOG_USUARIO
    `);

    // Unir ambos arrays de logs
    const todosLosLogs = [...eventos, ...usuarios];

    // Ordenarlos por fecha descendente
    todosLosLogs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json(todosLosLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener logs" });
  }
};
