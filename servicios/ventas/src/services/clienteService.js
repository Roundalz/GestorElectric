// services/clienteService.js
import clienteModel from "../models/clienteModel.js";
import logEventoModel from "../models/logEventoModel.js";

export const getClientes = async (vendedorId = 1, logData = {}) => {
  // Registrar acción de listar clientes
  await logEventoModel.createLogEvento({
    usuario_id: vendedorId,
    accion: "Listar clientes (compradores)",
    ip_origen: logData.ip || "0.0.0.0"
  });
  const clientes = await clienteModel.getClientesByVendedor(vendedorId);
  return clientes;
};

export default { getClientes };
