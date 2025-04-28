import * as characteristicModel from "../models/caracteristicaModel.js";

/**
 * characteristicService: maneja la lógica de negocio para CARACTERISTICAS
 * delegando en caracteristicaModel.
 */

// Asigna un conjunto de características a un producto
export async function setCharacteristics(productId, chars, vendedorId) {
  const result = await characteristicModel.setCharacteristics(productId, chars, vendedorId);
  return result;
}

// Obtiene todas las características asociadas a un producto
export async function getCharacteristicsByProduct(productId, vendedorId) {
  const characteristics = await characteristicModel.getCharacteristicsByProduct(productId, vendedorId);
  return characteristics;
}

// Actualiza una característica específica
export async function updateCharacteristic(charId, data, vendedorId) {
  const updatedChar = await characteristicModel.updateCharacteristic(charId, data, vendedorId);
  return updatedChar;
}

// Elimina todas las características de un producto
export async function deleteCharacteristicsByProduct(productId, vendedorId) {
  const deleted = await characteristicModel.deleteCharacteristicsByProduct(productId, vendedorId);
  return deleted;
}

export default {
  setCharacteristics,
  getCharacteristicsByProduct,
  updateCharacteristic,
  deleteCharacteristicsByProduct,
};
