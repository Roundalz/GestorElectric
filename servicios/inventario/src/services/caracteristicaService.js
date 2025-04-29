import * as characteristicModel from "../models/caracteristicaModel.js";

/**
 * characteristicService: maneja la lógica de negocio para CARACTERISTICAS
 * delegando en caracteristicaModel.
 */

/**
 * Asigna un conjunto de características a un producto,
 * reemplazando las existentes.
 * @param {number} productId
 * @param {Array<{ nombre_caracteristica: string, descripcion_caracteristica: string }>} chars
 * @returns {Object} { old, new }
 */
export async function setCharacteristics(productId, chars) {
  // TODO: validar que productId exista (opcional)
  const result = await characteristicModel.setCharacteristics(productId, chars);
  return result;
}

/**
 * Obtiene todas las características asociadas a un producto.
 * @param {number} productId
 * @returns {Array<Object>} Lista de características
 */
export async function getCharacteristicsByProduct(productId) {
  const characteristics = await characteristicModel.getCharacteristicsByProduct(productId);
  return characteristics;
}

/**
 * Actualiza una característica específica.
 * @param {number} charId
 * @param {{ nombre_caracteristica?: string, descripcion_caracteristica?: string }} data
 * @returns {Object} Característica actualizada
 */
export async function updateCharacteristic(charId, data) {
  const updatedChar = await characteristicModel.updateCharacteristic(charId, data);
  return updatedChar;
}

/**
 * Elimina todas las características de un producto.
 * @param {number} productId
 * @returns {Array<Object>} Características eliminadas (antes del borrado)
 */
export async function deleteCharacteristicsByProduct(productId) {
  const deleted = await characteristicModel.deleteCharacteristicsByProduct(productId);
  return deleted;
}

export default {
  setCharacteristics,
  getCharacteristicsByProduct,
  updateCharacteristic,
  deleteCharacteristicsByProduct,
};
