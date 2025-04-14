// services/clienteService.js
import clienteModel from "../models/clienteModel.js";

export const getClientes = async () => {
  return await clienteModel.getAllClientes();
};

export default {
  getClientes
};
