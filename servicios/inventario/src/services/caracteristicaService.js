// services/caracteristicaService.js
import * as caracteristicaModel from '../models/caracteristicaModel.js';

export const getCaracteristicasByProductoId = async (productoId) => {
  return await caracteristicaModel.getCaracteristicasByProductoId(productoId);
};

export const createCaracteristica = async (data) => {
  return await caracteristicaModel.createCaracteristica(data);
};

export const updateCaracteristica = async (id, data) => {
  return await caracteristicaModel.updateCaracteristica(id, data);
};

export const deleteCaracteristica = async (id) => {
  return await caracteristicaModel.deleteCaracteristica(id);
};

export default {
  getCaracteristicasByProductoId,
  createCaracteristica,
  updateCaracteristica,
  deleteCaracteristica
};
