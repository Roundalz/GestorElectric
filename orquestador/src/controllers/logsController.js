export const obtenerLogs = async (req, res) => {
  try {
    // Obtener logs de LOG_EVENTO con información del usuario
    const eventosQuery = await pool.query(`
      SELECT 
        le.id_logEvento AS id,
        le.accion,
        le.usuario_id AS usuario_id,
        COALESCE(v.nombre_vendedor, c.nombre_cliente, 'Sistema') AS nombre_usuario,
        le.fecha_hora AS fecha,
        le.ip_origen AS detalles,
        'evento' AS tipo_log
      FROM LOG_EVENTO le
      LEFT JOIN VENDEDOR v ON le.usuario_id = v.codigo_vendedore
      LEFT JOIN CLIENTE c ON le.usuario_id = c.codigo_cliente
      ORDER BY le.fecha_hora DESC
    `);

    // Obtener logs de LOG_USUARIO con información del usuario
    const usuariosQuery = await pool.query(`
      SELECT 
        lu.col_logUsuario AS id,
        'Login/Logout' AS accion,
        lu.usuario_id AS usuario_id,
        COALESCE(v.nombre_vendedor, c.nombre_cliente, 'Sistema') AS nombre_usuario,
        lu.fecha_hora AS fecha,
        lu.ip_origen AS detalles,
        'usuario' AS tipo_log
      FROM LOG_USUARIO lu
      LEFT JOIN VENDEDOR v ON lu.usuario_id = v.codigo_vendedore
      LEFT JOIN CLIENTE c ON lu.usuario_id = c.codigo_cliente
      ORDER BY lu.fecha_hora DESC
    `);

    // Combinar resultados
    const todosLosLogs = [...eventosQuery.rows, ...usuariosQuery.rows];

    // Ordenar por fecha (ya deberían estar ordenados por las consultas)
    todosLosLogs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json(todosLosLogs);
  } catch (error) {
    console.error("Error al obtener logs:", error);
    res.status(500).json({ error: "Error al obtener logs" });
  }
};
