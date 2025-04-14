// models/imgProductoModel.js
import pool from "../database.js";

export const createImgProducto = async (data) => {
  const query = `
    INSERT INTO IMG_PRODUCTO 
      (codigo_img_producto, primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto)
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

export const getImgsByProductoId = async (productoId) => {
  const query = "SELECT * FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1";
  const result = await pool.query(query, [productoId]);
  return result.rows;
};

export const updateImgProducto = async (id, data) => {
  const query = `
    UPDATE IMG_PRODUCTO 
    SET primer_angulo = $1,
        segundo_angulo = $2,
        tercer_angulo = $3,
        cuarto_angulo = $4
    WHERE codigo_img_producto = $5
    RETURNING *
  `;
  const values = [
    data.primer_angulo,
    data.segundo_angulo,
    data.tercer_angulo,
    data.cuarto_angulo,
    id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteImgProducto = async (id) => {
  const query = "DELETE FROM IMG_PRODUCTO WHERE codigo_img_producto = $1";
  await pool.query(query, [id]);
};

export default {
  createImgProducto,
  getImgsByProductoId,
  updateImgProducto,
  deleteImgProducto
};
