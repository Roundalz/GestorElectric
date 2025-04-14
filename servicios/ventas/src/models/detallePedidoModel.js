// models/detallePedidoModel.js
import pool from "../database.js";

export const getDetallesByVentaId = async (ventaId) => {
  const query = `
    SELECT dp.*, p.nombre_producto, p.tipo_producto, p.precio_unidad_producto
    FROM DETALLE_PEDIDO AS dp
    JOIN PRODUCTOS AS p ON dp.PRODUCTOS_codigo_producto = p.codigo_producto
    WHERE dp.PEDIDO_codigo_pedido = $1
  `;
  const result = await pool.query(query, [ventaId]);
  return result.rows;
};

export default {
  getDetallesByVentaId
};
