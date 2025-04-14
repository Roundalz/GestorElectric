// models/detallePedidoModel.js
import pool from "../database.js";

export const getDetallesByVentaId = async (ventaId) => {
  const query = `
    SELECT dp.*, pr.nombre_producto, pr.precio_unidad_producto 
    FROM DETALLE_PEDIDO dp
    JOIN PRODUCTOS pr ON dp.PRODUCTOS_codigo_producto = pr.codigo_producto
    WHERE dp.PEDIDO_codigo_pedido = $1
  `;
  const result = await pool.query(query, [ventaId]);
  return result.rows;
};

export default { getDetallesByVentaId };
