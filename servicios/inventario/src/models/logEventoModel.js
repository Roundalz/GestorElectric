import pool from "../database.js";

/**
 * Modelo para registrar eventos detallados en la tabla LOG_EVENTO.
 * Cada log incluye descripción construida a partir de los parámetros.
 */
export async function createLog({
  usuarioId,
  accion,
  tabla,
  campo,
  valorAnterior,
  valorNuevo,
  contexto = {},
  ipOrigen = null
}) {
  // Construye descripción detallada
  const parts = [
    `Acción: ${accion}`,
    `Tabla: ${tabla}`,
    `Campo: ${campo}`,
    `Valor anterior: ${valorAnterior}`,
    `Valor nuevo: ${valorNuevo}`
  ];
  // Agrega contexto si existe
  if (contexto.vendedor !== undefined) parts.push(`Vendedor: ${contexto.vendedor}`);
  if (contexto.portal !== undefined) parts.push(`Portal: ${contexto.portal}`);
  const descripcion = parts.join(' | ');

  const query = `
    INSERT INTO LOG_EVENTO
      (usuario_id, fecha_hora, accion, ip_origen)
    VALUES
      ($1, now(), $2, $3)
  `;
  const values = [usuarioId, descripcion, ipOrigen];
  await pool.query(query, values);
}

export default {
  createLog
};
