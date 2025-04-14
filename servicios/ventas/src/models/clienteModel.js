// models/clienteModel.js
import pool from "../database.js";

export const getAllClientes = async () => {
  // Opcionalmente, podrías hacer una consulta que sume la cantidad de compras y productos
  const query = `
    SELECT c.*, 
           COUNT(p.codigo_pedido) AS total_pedidos,
           COALESCE(SUM(dp.cantidad_detalle_pedido), 0) AS total_productos
    FROM CLIENTE c
    LEFT JOIN PEDIDO p ON c.codigo_cliente = p.CLIENTE_codigo_cliente
    LEFT JOIN DETALLE_PEDIDO dp ON p.codigo_pedido = dp.PEDIDO_codigo_pedido
    GROUP BY c.codigo_cliente
    ORDER BY c.codigo_cliente;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export default {
  getAllClientes
};
