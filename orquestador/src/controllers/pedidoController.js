import pool from '../database.js';

// Obtener todos los servicios
export const getPedido = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PEDIDO ORDER BY codigo_pedido ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};



// Obtener pedidos por ID de cliente (CLIENTE_codigo_cliente)
export const getPedidoByClienteId = async (req, res) => {
    const { clienteid } = req.params;
    try {
      const result = await pool.query('SELECT * FROM PEDIDO WHERE cliente_codigo_cliente = $1', [clienteid]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Pedidos de cliente no encontrado' });
      }
      res.json(result.rows);
    } catch (err) {
      console.error("Error al obtener pedidos de cliente:", err);
      res.status(500).json({ error: 'Error al obtener pedidos de cliente' });
    }
  };

export const crearPedido = async (req, res) => {
  const client = await pool.connect();
  try {
    const { clienteId, productos } = req.body;

    if (!clienteId || productos.length === 0) {
      return res.status(400).json({ error: 'Faltan datos para crear el pedido' });
    }

    // Calculamos el total
    const totalPedido = productos.reduce((acc, prod) => acc + prod.precio_unitario, 0);

    // Asumimos el primer vendedor
    const vendedorId = productos[0].vendedor_codigo_vendedore;

    await client.query('BEGIN');

    // Insertamos en PEDIDO
    const insertPedidoQuery = `
      INSERT INTO pedido (fecha_pedido, estado_pedido, total_pedido, cliente_codigo_cliente, vendedore_codigo_vendedore)
      VALUES (NOW(), 'Pendiente', $1, $2, $3)
      RETURNING codigo_pedido
    `;
    const pedidoResult = await client.query(insertPedidoQuery, [totalPedido, clienteId, vendedorId]);
    const codigoPedido = pedidoResult.rows[0].codigo_pedido;

    // Insertamos cada DETALLE_PEDIDO
    const insertDetalleQuery = `
      INSERT INTO detalle_pedido (cantidad_detalle_pedido, precio_unitario_, subtotal_detalle_pedido, pedido_codigo_pedido, productos_codigo_producto, calificacion_pedido)
      VALUES ($1, $2, $3, $4, $5, 5)
    `;

    for (const producto of productos) {
      await client.query(insertDetalleQuery, [
        1, // cantidad siempre 1
        producto.precio_unitario,
        producto.precio_unitario, // subtotal = precio * 1
        codigoPedido,
        producto.codigo_producto
      ]);
    }

    await client.query('COMMIT');
    res.json({ success: true, mensaje: 'Pedido creado exitosamente' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  } finally {
    client.release();
  }
};