import logEventoModel from "../models/logEventoModel.js";

/**
 * eventLogService: capa de servicio para manejar logs de evento
 * desacopla el modelo y permite enriquecer datos antes de persistir.
 */

/**
 * Registra un evento detallado en la tabla LOG_EVENTO.
 * @param {Object} params
 * @param {number} params.usuarioId       ID del usuario que origina el evento
 * @param {string} params.accion          Acción realizada (CREATE, UPDATE, DELETE)
 * @param {string} params.tabla           Nombre de la tabla afectada
 * @param {string} params.campo           Campo modificado o "ALL"
 * @param {any}    params.valorAnterior   Valor anterior del campo
 * @param {any}    params.valorNuevo      Valor nuevo del campo
 * @param {Object} [params.contexto]      Contexto adicional (e.g. { vendedor, portal })
 * @param {string|null} [params.ipOrigen] IP de origen, opcional
 */
export async function logEvent({
  usuarioId,
  accion,
  tabla,
  campo,
  valorAnterior,
  valorNuevo,
  contexto = {},
  ipOrigen = null
}) {
  // Construcción o enriquecimiento adicional se puede hacer aquí
  await logEventoModel.createLog({
    usuarioId,
    accion,
    tabla,
    campo,
    valorAnterior,
    valorNuevo,
    contexto,
    ipOrigen
  });
}

export default {
  logEvent
};