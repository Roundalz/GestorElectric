// servicios/inventario/src/models/productoModel.js

import pool from "../database.js";
import { getPortalCodeByVendedor } from "../config.js";
import { v4 as uuidv4 } from "uuid";
import logEventoModel from "./logEventoModel.js";

//const getPortalCodeByVendedor(vendedorId) = await getPortalCodeByVendedor(req.vendedorId);
export async function createProduct(data, vendedorIdParam) {
  const vendedorId = parseInt(vendedorIdParam, 10);
  if (!vendedorId || isNaN(vendedorId)) {
    throw new Error("VendedorId inválido");
  }

  const client = await pool.connect();
  try {
    const countRes = await client.query(
      `SELECT COUNT(*) FROM PRODUCTOS WHERE VENDEDOR_codigo_vendedore = $1`,
      [vendedorId]
    );
    const currentCount = parseInt(countRes.rows[0].count, 10);

    const planRes = await client.query(
      `SELECT p.codigo_plan, p.max_productos
         FROM VENDEDOR v JOIN PLANES_PAGO p ON v.PLANES_PAGO_codigo_plan = p.codigo_plan
        WHERE v.codigo_vendedore = $1`,
      [vendedorId]
    );
    if (!planRes.rowCount) throw new Error("Plan de pago no encontrado para vendedor");

    const { codigo_plan, max_productos } = planRes.rows[0];
    if (currentCount >= max_productos) throw new Error(`Límite de ${max_productos} productos alcanzado`);

    const allowed = codigo_plan * 2;
    if (data.imagenes?.length > allowed) throw new Error(`Máximo ${allowed} imágenes permitidas`);
    if (data.caracteristicas?.length > allowed) throw new Error(`Máximo ${allowed} características permitidas`);

    const portalCode = await getPortalCodeByVendedor(vendedorId);
    if (!portalCode) throw new Error("Portal no encontrado para vendedor");

    await client.query("BEGIN");

    const { rows: [newProduct] } = await client.query(`
      INSERT INTO PRODUCTOS (nombre_producto, tipo_producto, precio_unidad_producto,
        cantidad_disponible_producto, imagen_referencia_producto, estado_producto,
        calificacion_producto, costo_producto, descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *
    `, [
      data.nombre_producto, data.tipo_producto, data.precio_unidad_producto,
      data.cantidad_disponible_producto, data.imagen_referencia_producto, data.estado_producto,
      data.calificacion_producto, data.costo_producto, data.descuento_producto, vendedorId, portalCode
    ]);

    if (data.caracteristicas?.length) {
      for (const c of data.caracteristicas) {
        await client.query(`
          INSERT INTO CARACTERISTICAS (nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto)
          VALUES ($1,$2,$3)
        `, [c.nombre_caracteristica, c.descripcion_caracteristica, newProduct.codigo_producto]);
      }
    }

    if (data.imagenes?.length) {
      for (const i of data.imagenes) {
        await client.query(`
          INSERT INTO IMG_PRODUCTO (codigo_img_producto, primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto)
          VALUES ($1,$2,$3,$4,$5,$6)
        `, [uuidv4(), i.primer_angulo, i.segundo_angulo, i.tercer_angulo, i.cuarto_angulo, newProduct.codigo_producto]);
      }
    }

    await client.query("COMMIT");

    await logEventoModel.createLog({
      usuarioId: vendedorId,
      accion: "CREATE",
      tabla: "PRODUCTOS",
      campo: "ALL",
      valorAnterior: null,
      valorNuevo: JSON.stringify(newProduct),
      contexto: { vendedor: vendedorId, portal: portalCode }
    });

    return newProduct;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllProducts(vendedorId) {
  const query = `
    SELECT p.*, 
      COALESCE(json_agg(DISTINCT jsonb_build_object('codigo_caracteristica',c.codigo_caracteristica,'nombre_caracteristica',c.nombre_caracteristica,'descripcion_caracteristica',c.descripcion_caracteristica)) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]') AS caracteristicas,
      COALESCE(json_agg(DISTINCT jsonb_build_object('codigo_img_producto',i.codigo_img_producto,'primer_angulo',i.primer_angulo,'segundo_angulo',i.segundo_angulo,'tercer_angulo',i.tercer_angulo,'cuarto_angulo',i.cuarto_angulo)) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]') AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.VENDEDOR_codigo_vendedore = $1
    GROUP BY p.codigo_producto
    ORDER BY p.codigo_producto DESC;
  `;
  const { rows } = await pool.query(query, [vendedorId]);
  return rows;
}

export async function getProductById(id, vendedorId) {
  const query = `
    SELECT p.*, 
      COALESCE(json_agg(DISTINCT jsonb_build_object('codigo_caracteristica',c.codigo_caracteristica,'nombre_caracteristica',c.nombre_caracteristica,'descripcion_caracteristica',c.descripcion_caracteristica)) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]') AS caracteristicas,
      COALESCE(json_agg(DISTINCT jsonb_build_object('codigo_img_producto',i.codigo_img_producto,'primer_angulo',i.primer_angulo,'segundo_angulo',i.segundo_angulo,'tercer_angulo',i.tercer_angulo,'cuarto_angulo',i.cuarto_angulo)) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]') AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.codigo_producto = $1 AND p.VENDEDOR_codigo_vendedore = $2
    GROUP BY p.codigo_producto;
  `;
  const { rows } = await pool.query(query, [id, vendedorId]);
  return rows[0];
}

export async function getProductsByName(name, vendedorId) {
  const query = `
    SELECT p.*, 
      COALESCE(json_agg(DISTINCT jsonb_build_object('codigo_caracteristica',c.codigo_caracteristica,'nombre_caracteristica',c.nombre_caracteristica,'descripcion_caracteristica',c.descripcion_caracteristica)) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]') AS caracteristicas,
      COALESCE(json_agg(DISTINCT jsonb_build_object('codigo_img_producto',i.codigo_img_producto,'primer_angulo',i.primer_angulo,'segundo_angulo',i.segundo_angulo,'tercer_angulo',i.tercer_angulo,'cuarto_angulo',i.cuarto_angulo)) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]') AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.nombre_producto ILIKE '%' || $2 || '%' AND p.VENDEDOR_codigo_vendedore = $1
    GROUP BY p.codigo_producto
    ORDER BY p.codigo_producto DESC;
  `;
  const { rows } = await pool.query(query, [vendedorId, name]);
  return rows;
}
/**
 * Actualiza un producto y sus relaciones, registra logs de cambios.
 */
export async function updateProduct(id, data, vendedorId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: [oldProduct] } = await client.query(
      `SELECT * FROM PRODUCTOS WHERE codigo_producto = $1 AND VENDEDOR_codigo_vendedore = $2`,
      [id, vendedorId]
    );
    if (!oldProduct) throw new Error("Producto no encontrado");

    const portalCode = await getPortalCodeByVendedor(vendedorId);

    const fields = [];
    const values = [];
    let idx = 1;
    const mapping = {
      nombre_producto: data.nombre_producto,
      tipo_producto: data.tipo_producto,
      precio_unidad_producto: data.precio_unidad_producto,
      estado_producto: data.estado_producto,
      costo_producto: data.costo_producto,
      descuento_producto: data.descuento_producto,
      PORTAL_codigo_portal: portalCode,
    };

    for (const [field, val] of Object.entries(mapping)) {
      if (val !== undefined) {
        fields.push(`${field} = $${idx}`);
        values.push(val);
        idx++;
      }
    }

    if (!fields.length) throw new Error("Nada que actualizar en PRODUCTOS");

    const updateQuery = `
      UPDATE PRODUCTOS SET ${fields.join(", ")}
      WHERE codigo_producto = $${idx} AND VENDEDOR_codigo_vendedore = $${idx + 1}
      RETURNING *
    `;

    values.push(id, vendedorId);
    const { rows: [updatedProduct] } = await client.query(updateQuery, values);

    if (data.caracteristicas) {
      const { rows: oldChars } = await client.query(
        `SELECT * FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
        [id]
      );
      await client.query(`DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`, [id]);
      for (const char of data.caracteristicas) {
        await client.query(`
          INSERT INTO CARACTERISTICAS (nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto)
          VALUES ($1, $2, $3)`,
          [char.nombre_caracteristica, char.descripcion_caracteristica, id]
        );
      }
      await logEventoModel.createLog({
        usuarioId: vendedorId,
        accion: "UPDATE",
        tabla: "CARACTERISTICAS",
        campo: "ALL",
        valorAnterior: JSON.stringify(oldChars),
        valorNuevo: JSON.stringify(data.caracteristicas),
        contexto: { vendedor: vendedorId, portal: portalCode },
      });
    }

    if (data.imagenes) {
      const { rows: oldImgs } = await client.query(
        `SELECT * FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`,
        [id]
      );
      await client.query(`DELETE FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`, [id]);
      for (const img of data.imagenes) {
        await client.query(`
          INSERT INTO IMG_PRODUCTO (codigo_img_producto, primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto)
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [uuidv4(), img.primer_angulo, img.segundo_angulo, img.tercer_angulo, img.cuarto_angulo, id]
        );
      }
      await logEventoModel.createLog({
        usuarioId: vendedorId,
        accion: "UPDATE",
        tabla: "IMG_PRODUCTO",
        campo: "ALL",
        valorAnterior: JSON.stringify(oldImgs),
        valorNuevo: JSON.stringify(data.imagenes),
        contexto: { vendedor: vendedorId, portal: portalCode },
      });
    }

    await client.query("COMMIT");

    for (const field of Object.keys(mapping)) {
      if (mapping[field] !== undefined && oldProduct[field] !== updatedProduct[field]) {
        await logEventoModel.createLog({
          usuarioId: vendedorId,
          accion: "UPDATE",
          tabla: "PRODUCTOS",
          campo: field,
          valorAnterior: oldProduct[field],
          valorNuevo: updatedProduct[field],
          contexto: { vendedor: vendedorId, portal: portalCode },
        });
      }
    }

    return updatedProduct;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
/**
 * Actualiza únicamente la cantidad disponible de un producto.
 */
export async function updateQuantity(id, newQuantity, vendedorId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: [prod] } = await client.query(
      `SELECT cantidad_disponible_producto FROM PRODUCTOS
       WHERE codigo_producto = $1 AND VENDEDOR_codigo_vendedore = $2`,
      [id, vendedorId]
    );
    if (!prod) throw new Error("Producto no encontrado");

    const oldQty = prod.cantidad_disponible_producto;
    const { rows: [updated] } = await client.query(
      `UPDATE PRODUCTOS
         SET cantidad_disponible_producto = $1
       WHERE codigo_producto = $2 AND VENDEDOR_codigo_vendedore = $3
       RETURNING cantidad_disponible_producto`,
      [newQuantity, id, vendedorId]
    );

    await client.query("COMMIT");
    await logEventoModel.createLog({
      usuarioId: vendedorId,
      accion: "UPDATE",
      tabla: "PRODUCTOS",
      campo: "cantidad_disponible_producto",
      valorAnterior: oldQty,
      valorNuevo: updated.cantidad_disponible_producto,
      contexto: { vendedor: vendedorId, portal: getPortalCodeByVendedor(vendedorId) },
    });

    return updated.cantidad_disponible_producto;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Elimina un producto y todos sus datos relacionados en cascada,
 * registrando un log detallado.
 */
export async function deleteProduct(id, vendedorId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Obtener estado anterior para el log
    const { rows: [oldProd] } = await client.query(
      `SELECT * FROM PRODUCTOS
       WHERE codigo_producto = $1 AND VENDEDOR_codigo_vendedore = $2`,
      [id, vendedorId]
    );
    if (!oldProd) throw new Error("Producto no encontrado");

    // Borrar dependientes
    await client.query(`DELETE FROM DETALLE_PEDIDO WHERE PRODUCTOS_codigo_producto = $1`, [id]);
    await client.query(`DELETE FROM FAVORITOS WHERE PRODUCTOS_codigo_producto = $1`, [id]);
    await client.query(`DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`, [id]);
    await client.query(`DELETE FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`, [id]);

    // Borrar producto
    await client.query(
      `DELETE FROM PRODUCTOS
       WHERE codigo_producto = $1 AND VENDEDOR_codigo_vendedore = $2`,
      [id, vendedorId]
    );

    await client.query("COMMIT");
    const portalCode = await getPortalCodeByVendedor(vendedorId);
    await logEventoModel.createLog({
      usuarioId: vendedorId,
      accion: "DELETE",
      tabla: "PRODUCTOS",
      campo: "ALL",
      valorAnterior: JSON.stringify(oldProd),
      valorNuevo: null,
      contexto: { vendedor: vendedorId, portal: portalCode},
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}



export default {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByName,
  updateProduct,
  updateQuantity,
  deleteProduct,
};
