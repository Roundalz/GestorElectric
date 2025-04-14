// models/ventaModel.js
import pool from "../database.js";

export const getAllVentasByVendedor = async (vendedorId = 1) => {
  const query = `
    SELECT p.*, c.nombre_cliente 
    FROM PEDIDO p
    LEFT JOIN CLIENTE c ON p.CLIENTE_codigo_cliente = c.codigo_cliente
    WHERE p.VENDEDORE_codigo_vendedore = $1
    ORDER BY p.codigo_pedido DESC
  `;
  const result = await pool.query(query, [vendedorId]);
  return result.rows;
};

export const getVentaByIdAndVendedor = async (id, vendedorId = 1) => {
  const query = `
    SELECT p.*, c.nombre_cliente 
    FROM PEDIDO p
    LEFT JOIN CLIENTE c ON p.CLIENTE_codigo_cliente = c.codigo_cliente
    WHERE p.codigo_pedido = $1 AND p.VENDEDORE_codigo_vendedore = $2
  `;
  const result = await pool.query(query, [id, vendedorId]);
  return result.rows[0];
};

export default { getAllVentasByVendedor, getVentaByIdAndVendedor };
