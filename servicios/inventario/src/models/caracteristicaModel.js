// models/caracteristicaModel.js
import pool from '../database.js';

export const getCaracteristicasByProductoId = async (productoId) => {
  const query = 'SELECT * FROM caracteristicas WHERE PRODUCTOS_codigo_producto = $1';
  const result = await pool.query(query, [productoId]);
  return result.rows;
};

export const createCaracteristica = async (data) => {
  const query = `
    INSERT INTO caracteristicas 
      (nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [data.nombre_caracteristica, data.descripcion_caracteristica, data.PRODUCTOS_codigo_producto];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateCaracteristica = async (id, data) => {
  const query = `
    UPDATE caracteristicas
    SET nombre_caracteristica = $1,
        descripcion_caracteristica = $2,
        PRODUCTOS_codigo_producto = $3
    WHERE codigo_caracteristica = $4
    RETURNING *
  `;
  const values = [
    data.nombre_caracteristica,
    data.descripcion_caracteristica,
    data.PRODUCTOS_codigo_producto,
    id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteCaracteristica = async (id) => {
  const query = 'DELETE FROM caracteristicas WHERE codigo_caracteristica = $1';
  await pool.query(query, [id]);
};

export default {
  getCaracteristicasByProductoId,
  createCaracteristica,
  updateCaracteristica,
  deleteCaracteristica
};
