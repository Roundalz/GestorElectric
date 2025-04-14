// services/ventaService.js
import ventaModel from "../models/ventaModel.js";
import detallePedidoModel from "../models/detallePedidoModel.js";
import logEventoModel from "../models/logEventoModel.js";

export const getVentas = async (vendedorId = 1, logData = {}) => {
  await logEventoModel.createLogEvento({
    usuario_id: vendedorId,
    accion: "Listar ventas",
    ip_origen: logData.ip || "0.0.0.0"
  });
  const ventas = await ventaModel.getAllVentasByVendedor(vendedorId);
  return ventas;
};

export const getVentaDetail = async (id, vendedorId = 1, logData = {}) => {
  await logEventoModel.createLogEvento({
    usuario_id: vendedorId,
    accion: `Ver detalle de venta ${id}`,
    ip_origen: logData.ip || "0.0.0.0"
  });
  const venta = await ventaModel.getVentaByIdAndVendedor(id, vendedorId);
  if (venta) {
    const detalles = await detallePedidoModel.getDetallesByVentaId(id);
    venta.detalles = detalles;
  }
  return venta;
};

export default { getVentas, getVentaDetail };
