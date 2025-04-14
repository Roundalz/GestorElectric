// models/ventaModel.js
import pool from "../database.js";

export const getAllVentas = async () => {
  const query = `
    SELECT p.*, c.nombre_cliente 
    FROM PEDIDO p
    LEFT JOIN CLIENTE c ON p.CLIENTE_codigo_cliente = c.codigo_cliente
    ORDER BY p.codigo_pedido DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getVentaById = async (id) => {
  const query = `
    SELECT p.*, c.nombre_cliente 
    FROM PEDIDO p 
    LEFT JOIN CLIENTE c ON p.CLIENTE_codigo_cliente = c.codigo_cliente 
    WHERE p.codigo_pedido = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export default { getAllVentas, getVentaById };
