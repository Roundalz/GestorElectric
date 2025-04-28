// servicios/nuevoServicio/src/models/clienteModel.js
const db = require('../database');

async function listarClientes(vendedorId) {
  const query = `
    SELECT DISTINCT c.codigo_cliente, c.nombre_cliente, c.correo_cliente
    FROM CLIENTE c
    INNER JOIN PEDIDO p ON c.codigo_cliente = p.CLIENTE_codigo_cliente
    WHERE p.VENDEDORE_codigo_vendedore = $1
  `;
  const { rows } = await db.query(query, [vendedorId]);
  return rows;
}

async function obtenerClientePorId(clienteId) {
  const query = `
    SELECT *
    FROM CLIENTE
    WHERE codigo_cliente = $1
  `;
  const { rows } = await db.query(query, [clienteId]);
  return rows[0];
}

module.exports = {
  listarClientes,
  obtenerClientePorId,
};
