// models/clienteModel.js
import pool from "../database.js";

export const getClientesByVendedor = async (vendedorId = 1) => {
  const query = `
    SELECT c.*, 
           COUNT(DISTINCT p.codigo_pedido) AS total_pedidos,
           COALESCE(SUM(dp.cantidad_detalle_pedido), 0) AS total_productos
    FROM CLIENTE c
    JOIN PEDIDO p ON c.codigo_cliente = p.CLIENTE_codigo_cliente
    LEFT JOIN DETALLE_PEDIDO dp ON p.codigo_pedido = dp.PEDIDO_codigo_pedido
    WHERE p.VENDEDORE_codigo_vendedore = $1
    GROUP BY c.codigo_cliente
    ORDER BY c.codigo_cliente
  `;
  const result = await pool.query(query, [vendedorId]);
  return result.rows;
};

export default { getClientesByVendedor };
