// services/imgProductoService.js
import * as imgProductoModel from '../models/imgProductoModel.js';

export const getImgsByProductoId = async (productoId) => {
  return await imgProductoModel.getImgsByProductoId(productoId);
};

export const createImgProducto = async (data) => {
  return await imgProductoModel.createImgProducto(data);
};

export const updateImgProducto = async (id, data) => {
  return await imgProductoModel.updateImgProducto(id, data);
};

export const deleteImgProducto = async (id) => {
  return await imgProductoModel.deleteImgProducto(id);
};

export default {
  getImgsByProductoId,
  createImgProducto,
  updateImgProducto,
  deleteImgProducto
};
