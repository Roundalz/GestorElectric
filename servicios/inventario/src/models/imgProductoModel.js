// models/imgProductoModel.js
import pool from '../database.js';

export const getImgsByProductoId = async (productoId) => {
  const query = 'SELECT * FROM img_producto WHERE PRODUCTOS_codigo_producto = $1';
  const result = await pool.query(query, [productoId]);
  return result.rows;
};

export const createImgProducto = async (data) => {
  const query = `
    INSERT INTO img_producto (codigo_img_producto, primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    data.codigo_img_producto,
    data.primer_angulo,
    data.segundo_angulo,
    data.tercer_angulo,
    data.cuarto_angulo,
    data.PRODUCTOS_codigo_producto
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateImgProducto = async (id, data) => {
  const query = `
    UPDATE img_producto
    SET primer_angulo = $1,
        segundo_angulo = $2,
        tercer_angulo = $3,
        cuarto_angulo = $4,
        PRODUCTOS_codigo_producto = $5
    WHERE codigo_img_producto = $6
    RETURNING *
  `;
  const values = [
    data.primer_angulo,
    data.segundo_angulo,
    data.tercer_angulo,
    data.cuarto_angulo,
    data.PRODUCTOS_codigo_producto,
    id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteImgProducto = async (id) => {
  const query = 'DELETE FROM img_producto WHERE codigo_img_producto = $1';
  await pool.query(query, [id]);
};

export default { getImgsByProductoId, createImgProducto, updateImgProducto, deleteImgProducto };
