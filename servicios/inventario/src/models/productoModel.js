// models/productoModel.js
import pool from "../database.js";

// Crear producto (sin campo serial, ya que la secuencia lo autogenera)
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
    data.VENDEDOR_codigo_vendedore, // Debe ser 1 para vendedor 1
    data.PORTAL_codigo_portal
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllProductosByVendedor = async (vendedorId = 1) => {
  const query = `
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'codigo_caracteristica', c.codigo_caracteristica,
            'nombre_caracteristica', c.nombre_caracteristica,
            'descripcion_caracteristica', c.descripcion_caracteristica
          )
        ) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]'
      ) AS caracteristicas,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'codigo_img_producto', i.codigo_img_producto,
            'primer_angulo', i.primer_angulo,
            'segundo_angulo', i.segundo_angulo,
            'tercer_angulo', i.tercer_angulo,
            'cuarto_angulo', i.cuarto_angulo
          )
        ) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]'
      ) AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c 
      ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i 
      ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.VENDEDOR_codigo_vendedore = $1
    GROUP BY p.codigo_producto
    ORDER BY p.codigo_producto DESC;
  `;
  const result = await pool.query(query, [vendedorId]);
  return result.rows;
};

export const getProductoByIdAndVendedor = async (id, vendedorId = 1) => {
  const query = `
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'codigo_caracteristica', c.codigo_caracteristica,
            'nombre_caracteristica', c.nombre_caracteristica,
            'descripcion_caracteristica', c.descripcion_caracteristica
          )
        ) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]'
      ) AS caracteristicas,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'codigo_img_producto', i.codigo_img_producto,
            'primer_angulo', i.primer_angulo,
            'segundo_angulo', i.segundo_angulo,
            'tercer_angulo', i.tercer_angulo,
            'cuarto_angulo', i.cuarto_angulo
          )
        ) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]'
      ) AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c 
      ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i 
      ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.codigo_producto = $1 
      AND p.VENDEDOR_codigo_vendedore = $2
    GROUP BY p.codigo_producto;
  `;
  const result = await pool.query(query, [id, vendedorId]);
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
        PORTAL_codigo_portal = $10
    WHERE codigo_producto = $11
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
    data.PORTAL_codigo_portal,
    id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteProducto = async (id) => {
  // Primero, es conveniente eliminar registros relacionados en las otras tablas
  // (por ejemplo, Características e Imágenes) mediante transacción, pero aquí se muestra en forma secuencial
  const deleteCaracteristicasQuery = "DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1";
  await pool.query(deleteCaracteristicasQuery, [id]);

  const deleteImagenesQuery = "DELETE FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1";
  await pool.query(deleteImagenesQuery, [id]);

  const deleteQuery = "DELETE FROM PRODUCTOS WHERE codigo_producto = $1";
  await pool.query(deleteQuery, [id]);
};

export default {
  createProducto,
  getAllProductosByVendedor,
  getProductoByIdAndVendedor,
  updateProducto,
  deleteProducto
};
