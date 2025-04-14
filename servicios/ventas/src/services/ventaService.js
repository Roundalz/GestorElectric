// services/ventaService.js
import ventaModel from "../models/ventaModel.js";
import detallePedidoModel from "../models/detallePedidoModel.js";

export const getVentas = async () => {
  return await ventaModel.getAllVentas();
};

export const getVentaDetail = async (id) => {
  const venta = await ventaModel.getVentaById(id);
  if (venta) {
    const detalles = await detallePedidoModel.getDetallesByVentaId(id);
    venta.detalles = detalles;
  }
  return venta;
};

export default {
  getVentas,
  getVentaDetail
};
