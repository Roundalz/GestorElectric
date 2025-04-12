// models/productoModel.js
import pool from '../database.js';

export const getAllProductos = async () => {
  const query = 'SELECT * FROM PRODUCTOS';
  const result = await pool.query(query);
  return result.rows;
};

export const getProductoById = async (id) => {
  const query = 'SELECT * FROM PRODUCTOS WHERE codigo_producto = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const createProducto = async (data) => {
  const query = `
    INSERT INTO PRODUCTOS 
      (nombre_producto, tipo_producto, precio_unidad_producto, cantidad_disponible_producto, imagen_referencia_producto, estado_producto, calificacion_producto, costo_producto, descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  const values = [
    data.nombre_producto,
    data.tipo_producto,
    data.precio_unidad_producto,
    data.cantidad_disponible_producto,
    data.imagen_referencia_producto,
    data.estado_producto,
    data.calificacion_producto,
    data.costo_producto,
    data.descuento_producto,
    data.VENDEDOR_codigo_vendedore,
    data.PORTAL_codigo_portal
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateProducto = async (id, data) => {
  const query = `
    UPDATE PRODUCTOS 
    SET nombre_producto = $1,
        tipo_producto = $2,
        precio_unidad_producto = $3,
        cantidad_disponible_producto = $4,
        imagen_referencia_producto = $5,
        estado_producto = $6,
        calificacion_producto = $7,
        costo_producto = $8,
        descuento_producto = $9,
        VENDEDOR_codigo_vendedore = $10,
        PORTAL_codigo_portal = $11
    WHERE codigo_producto = $12 
    RETURNING *
  `;
  const values = [
    data.nombre_producto,
    data.tipo_producto,
    data.precio_unidad_producto,
    data.cantidad_disponible_producto,
    data.imagen_referencia_producto,
    data.estado_producto,
    data.calificacion_producto,
    data.costo_producto,
    data.descuento_producto,
    data.VENDEDOR_codigo_vendedore,
    data.PORTAL_codigo_portal,
    id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteProducto = async (id) => {
  const query = 'DELETE FROM PRODUCTOS WHERE codigo_producto = $1';
  await pool.query(query, [id]);
};

export default {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
