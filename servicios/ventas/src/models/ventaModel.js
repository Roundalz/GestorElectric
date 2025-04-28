// servicios/nuevoServicio/src/models/ventaModel.js
const db = require('../database');

async function listarVentas(vendedorId) {
  const query = `
    SELECT p.codigo_pedido, p.fecha_pedido, p.estado_pedido, p.total_pedido,
           c.nombre_cliente, c.correo_cliente,
           (SELECT array_agg(json_build_object(
                'producto', pr.nombre_producto,
                'cantidad', dp.cantidad_detalle_pedido,
                'precio', dp.precio_unitario_,
                'subtotal', dp.subtotal_detalle_pedido
            ))
            FROM DETALLE_PEDIDO dp
            INNER JOIN PRODUCTOS pr ON dp.PRODUCTOS_codigo_producto = pr.codigo_producto
            WHERE dp.PEDIDO_codigo_pedido = p.codigo_pedido
           ) AS productos,
           (SELECT gc.clave_gift_card
            FROM DESCUENTO_PEDIDO dp
            INNER JOIN GIFT_CARDS gc ON gc.codigo_gift_card = dp.PEDIDO_codigo_pedido
            WHERE dp.PEDIDO_codigo_pedido = p.codigo_pedido
            LIMIT 1
           ) AS giftcard_aplicada
    FROM PEDIDO p
    INNER JOIN CLIENTE c ON c.codigo_cliente = p.CLIENTE_codigo_cliente
    WHERE p.VENDEDORE_codigo_vendedore = $1
    ORDER BY p.fecha_pedido DESC
  `;
  const { rows } = await db.query(query, [vendedorId]);
  return rows;
}

async function obtenerVentaPorId(vendedorId, ventaId) {
  const query = `
    SELECT p.codigo_pedido, p.fecha_pedido, p.estado_pedido, p.total_pedido,
           c.*, 
           (SELECT array_agg(json_build_object(
                'producto', pr.nombre_producto,
                'cantidad', dp.cantidad_detalle_pedido,
                'precio', dp.precio_unitario_,
                'subtotal', dp.subtotal_detalle_pedido
            ))
            FROM DETALLE_PEDIDO dp
            INNER JOIN PRODUCTOS pr ON dp.PRODUCTOS_codigo_producto = pr.codigo_producto
            WHERE dp.PEDIDO_codigo_pedido = p.codigo_pedido
           ) AS productos,
           (SELECT gc.clave_gift_card
            FROM DESCUENTO_PEDIDO dp
            INNER JOIN GIFT_CARDS gc ON gc.codigo_gift_card = dp.PEDIDO_codigo_pedido
            WHERE dp.PEDIDO_codigo_pedido = p.codigo_pedido
            LIMIT 1
           ) AS giftcard_aplicada
    FROM PEDIDO p
    INNER JOIN CLIENTE c ON c.codigo_cliente = p.CLIENTE_codigo_cliente
    WHERE p.VENDEDORE_codigo_vendedore = $1
      AND p.codigo_pedido = $2
    LIMIT 1
  `;
  const { rows } = await db.query(query, [vendedorId, ventaId]);
  return rows[0];
}

module.exports = {
  listarVentas,
  obtenerVentaPorId,
};
