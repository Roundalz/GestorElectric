// servicios/nuevoServicio/src/models/logEventoModel.js
import db from '../db.js'; 
async function registrarLog(usuarioId, accion, ipOrigen = null) {
  const query = `
    INSERT INTO LOG_EVENTO (usuario_id, fecha_hora, accion, ip_origen)
    VALUES ($1, NOW(), $2, $3)
  `;
  await db.query(query, [usuarioId, accion, ipOrigen]);
}

export default {
  registrarLog,
};