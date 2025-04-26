import pool from "../database.js";
import { VENDEDOR_ID, PORTAL_CODE } from "../config.js";
import { v4 as uuidv4 } from "uuid";
import logEventoModel from "./logEventoModel.js";

/**
 * Modelo para manejar CRUD de PRODUCTOS con validaciones de plan, imágenes,
 * características y registro de logs de eventos detallados.
 */

/**
 * Crea un nuevo producto, valida límites según PLANES_PAGO,
 * inserta características e imágenes, y registra eventos.
 */
export async function createProduct(data) {
  const client = await pool.connect();
  try {
    // 1) Validar número de productos actuales
    const countRes = await client.query(
      `SELECT COUNT(*) AS count
         FROM PRODUCTOS
        WHERE VENDEDOR_codigo_vendedore = $1`,
      [VENDEDOR_ID]
    );
    const currentCount = parseInt(countRes.rows[0].count, 10);

    // 2) Obtener plan de pago y límites
    const planRes = await client.query(
      `SELECT p.codigo_plan, p.max_productos
         FROM VENDEDOR v
         JOIN PLANES_PAGO p ON v.PLANES_PAGO_codigo_plan = p.codigo_plan
        WHERE v.codigo_vendedore = $1`,
      [VENDEDOR_ID]
    );
    if (!planRes.rowCount) {
      throw new Error("Plan de pago no encontrado para el vendedor");
    }
    const { codigo_plan, max_productos } = planRes.rows[0];
    if (currentCount >= max_productos) {
      throw new Error(`Has alcanzado el límite de ${max_productos} productos de tu plan`);
    }

    // 3) Límite de imágenes y características por producto
    const allowedImages = codigo_plan * 2;
    const allowedChars = codigo_plan * 2;
    if (data.imagenes?.length > allowedImages) {
      throw new Error(`Máximo de ${allowedImages} imágenes permitidas`);
    }
    if (data.caracteristicas?.length > allowedChars) {
      throw new Error(`Máximo de ${allowedChars} características permitidas`);
    }

    // 4) Iniciar transacción
    await client.query("BEGIN");

    // 5) Insertar producto
    const insertProductText = `
      INSERT INTO PRODUCTOS
        (nombre_producto, tipo_producto, precio_unidad_producto,
         cantidad_disponible_producto, imagen_referencia_producto,
         estado_producto, calificacion_producto, costo_producto,
         descuento_producto, VENDEDOR_codigo_vendedore, PORTAL_codigo_portal)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;
    const insertProductValues = [
      data.nombre_producto,
      data.tipo_producto,
      data.precio_unidad_producto,
      data.cantidad_disponible_producto,
      data.imagen_referencia_producto,
      data.estado_producto,
      data.calificacion_producto,
      data.costo_producto,
      data.descuento_producto,
      VENDEDOR_ID,
      PORTAL_CODE,
    ];
    const { rows: [newProduct] } = await client.query(insertProductText, insertProductValues);

    // 6) Insertar características (si las hay)
    if (data.caracteristicas?.length) {
      for (const char of data.caracteristicas) {
        const insertCharText = `
          INSERT INTO CARACTERISTICAS
            (nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto)
          VALUES ($1,$2,$3)
        `;
        await client.query(insertCharText, [
          char.nombre_caracteristica,
          char.descripcion_caracteristica,
          newProduct.codigo_producto,
        ]);
      }
    }

    // 7) Insertar imágenes (si las hay)
    if (data.imagenes?.length) {
      for (const img of data.imagenes) {
        const codigoImg = uuidv4();
        const insertImgText = `
          INSERT INTO IMG_PRODUCTO
            (codigo_img_producto, primer_angulo, segundo_angulo,
             tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto)
          VALUES ($1,$2,$3,$4,$5,$6)
        `;
        await client.query(insertImgText, [
          codigoImg,
          img.primer_angulo,
          img.segundo_angulo,
          img.tercer_angulo,
          img.cuarto_angulo,
          newProduct.codigo_producto,
        ]);
      }
    }

    // 8) Commit de la transacción
    await client.query("COMMIT");

    // 9) Registrar logs de evento post-commit
    await logEventoModel.createLog({
      usuarioId: VENDEDOR_ID,
      accion: "CREATE",
      tabla: "PRODUCTOS",
      campo: "ALL",
      valorAnterior: null,
      valorNuevo: JSON.stringify(newProduct),
      contexto: { vendedor: VENDEDOR_ID, portal: PORTAL_CODE },
    });

    return newProduct;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Obtiene todos los productos del vendedor, con sus imágenes y características.
 */
export async function getAllProducts() {
  const query = `
    SELECT
      p.*, 
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'codigo_caracteristica', c.codigo_caracteristica,
        'nombre_caracteristica', c.nombre_caracteristica,
        'descripcion_caracteristica', c.descripcion_caracteristica
      )) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]') AS caracteristicas,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'codigo_img_producto', i.codigo_img_producto,
        'primer_angulo', i.primer_angulo,
        'segundo_angulo', i.segundo_angulo,
        'tercer_angulo', i.tercer_angulo,
        'cuarto_angulo', i.cuarto_angulo
      )) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]') AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.VENDEDOR_codigo_vendedore = $1
    GROUP BY p.codigo_producto
    ORDER BY p.codigo_producto DESC;
  `;
  const { rows } = await pool.query(query, [VENDEDOR_ID]);
  return rows;
}

/**
 * Obtiene un producto por ID, validando vendedor.
 */
export async function getProductById(id) {
  const query = `
    SELECT
      p.*, 
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'codigo_caracteristica', c.codigo_caracteristica,
        'nombre_caracteristica', c.nombre_caracteristica,
        'descripcion_caracteristica', c.descripcion_caracteristica
      )) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]') AS caracteristicas,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'codigo_img_producto', i.codigo_img_producto,
        'primer_angulo', i.primer_angulo,
        'segundo_angulo', i.segundo_angulo,
        'tercer_angulo', i.tercer_angulo,
        'cuarto_angulo', i.cuarto_angulo
      )) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]') AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.codigo_producto = $1
      AND p.VENDEDOR_codigo_vendedore = $2
    GROUP BY p.codigo_producto;
  `;
  const { rows } = await pool.query(query, [id, VENDEDOR_ID]);
  return rows[0];
}

/**
 * Busca productos por nombre (ILIKE), con paginación básica.
 */
export async function getProductsByName(name) {
  const query = `
    SELECT
      p.*, 
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'codigo_caracteristica', c.codigo_caracteristica,
        'nombre_caracteristica', c.nombre_caracteristica,
        'descripcion_caracteristica', c.descripcion_caracteristica
      )) FILTER (WHERE c.codigo_caracteristica IS NOT NULL), '[]') AS caracteristicas,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'codigo_img_producto', i.codigo_img_producto,
        'primer_angulo', i.primer_angulo,
        'segundo_angulo', i.segundo_angulo,
        'tercer_angulo', i.tercer_angulo,
        'cuarto_angulo', i.cuarto_angulo
      )) FILTER (WHERE i.codigo_img_producto IS NOT NULL), '[]') AS imagenes
    FROM PRODUCTOS p
    LEFT JOIN CARACTERISTICAS c ON p.codigo_producto = c.PRODUCTOS_codigo_producto
    LEFT JOIN IMG_PRODUCTO i ON p.codigo_producto = i.PRODUCTOS_codigo_producto
    WHERE p.VENDEDOR_codigo_vendedore = $1
      AND p.nombre_producto ILIKE '%' || $2 || '%'
    GROUP BY p.codigo_producto
    ORDER BY p.codigo_producto DESC;
  `;
  const { rows } = await pool.query(query, [VENDEDOR_ID, name]);
  return rows;
}

/**
 * Actualiza un producto y sus relaciones, registra logs de cambios.
 */
export async function updateProduct(id, data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Obtener estado anterior
    const { rows: [oldProduct] } = await client.query(
      `SELECT * FROM PRODUCTOS WHERE codigo_producto = $1 AND VENDEDOR_codigo_vendedore = $2`,
      [id, VENDEDOR_ID]
    );
    if (!oldProduct) throw new Error("Producto no encontrado");

    // Construcción dinámica de campos a actualizar
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
      PORTAL_codigo_portal: data.PORTAL_codigo_portal,
    };
    for (const [field, val] of Object.entries(mapping)) {
      if (val !== undefined) {
        fields.push(`${field} = $${idx}`);
        values.push(val);
        idx++;
      }
    }
    if (!fields.length) throw new Error("Nada que actualizar en PRODUCTOS");

    // Ejecutar actualización
    const updateQuery = `
      UPDATE PRODUCTOS SET ${fields.join(", ")}
      WHERE codigo_producto = $${idx} AND VENDEDOR_codigo_vendedore = $${idx + 1}
      RETURNING *
    `;
    values.push(id, VENDEDOR_ID);
    const { rows: [updatedProduct] } = await client.query(updateQuery, values);

    // Actualizar características si vienen
    if (data.caracteristicas) {
      // Obtener antes
      const { rows: oldChars } = await client.query(
        `SELECT * FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
        [id]
      );
      await client.query(
        `DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
        [id]
      );
      for (const char of data.caracteristicas) {
        await client.query(
          `INSERT INTO CARACTERISTICAS
             (nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto)
           VALUES ($1,$2,$3)`,
          [char.nombre_caracteristica, char.descripcion_caracteristica, id]
        );
      }
      await logEventoModel.createLog({
        usuarioId: VENDEDOR_ID,
        accion: "UPDATE",
        tabla: "CARACTERISTICAS",
        campo: "ALL",
        valorAnterior: JSON.stringify(oldChars),
        valorNuevo: JSON.stringify(data.caracteristicas),
        contexto: { vendedor: VENDEDOR_ID, portal: PORTAL_CODE },
      });
    }

    // Actualizar imágenes si vienen
    if (data.imagenes) {
      const { rows: oldImgs } = await client.query(
        `SELECT * FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`,
        [id]
      );
      await client.query(
        `DELETE FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`,
        [id]
      );
      for (const img of data.imagenes) {
        const codigoImg = uuidv4();
        await client.query(
          `INSERT INTO IMG_PRODUCTO
             (codigo_img_producto, primer_angulo, segundo_angulo,
              tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            codigoImg,
            img.primer_angulo,
            img.segundo_angulo,
            img.tercer_angulo,
            img.cuarto_angulo,
            id,
          ]
        );
      }
      await logEventoModel.createLog({
        usuarioId: VENDEDOR_ID,
        accion: "UPDATE",
        tabla: "IMG_PRODUCTO",
        campo: "ALL",
        valorAnterior: JSON.stringify(oldImgs),
        valorNuevo: JSON.stringify(data.imagenes),
        contexto: { vendedor: VENDEDOR_ID, portal: PORTAL_CODE },
      });
    }

    await client.query("COMMIT");

    // Registrar logs de campos individuales
    for (const field of Object.keys(mapping)) {
      if (mapping[field] !== undefined && oldProduct[field] !== updatedProduct[field]) {
        await logEventoModel.createLog({
          usuarioId: VENDEDOR_ID,
          accion: "UPDATE",
          tabla: "PRODUCTOS",
          campo: field,
          valorAnterior: oldProduct[field],
          valorNuevo: updatedProduct[field],
          contexto: { vendedor: VENDEDOR_ID, portal: PORTAL_CODE },
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
export async function updateQuantity(id, newQuantity) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: [prod] } = await client.query(
      `SELECT cantidad_disponible_producto FROM PRODUCTOS
       WHERE codigo_producto = $1 AND VENDEDOR_codigo_vendedore = $2`,
      [id, VENDEDOR_ID]
    );
    if (!prod) throw new Error("Producto no encontrado");

    const oldQty = prod.cantidad_disponible_producto;
    const { rows: [updated] } = await client.query(
      `UPDATE PRODUCTOS
         SET cantidad_disponible_producto = $1
       WHERE codigo_producto = $2 AND VENDEDOR_codigo_vendedore = $3
       RETURNING cantidad_disponible_producto`,
      [newQuantity, id, VENDEDOR_ID]
    );

    await client.query("COMMIT");
    await logEventoModel.createLog({
      usuarioId: VENDEDOR_ID,
      accion: "UPDATE",
      tabla: "PRODUCTOS",
      campo: "cantidad_disponible_producto",
      valorAnterior: oldQty,
      valorNuevo: updated.cantidad_disponible_producto,
      contexto: { vendedor: VENDEDOR_ID, portal: PORTAL_CODE },
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
export async function deleteProduct(id) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Obtener estado anterior para el log
    const { rows: [oldProd] } = await client.query(
      `SELECT * FROM PRODUCTOS
       WHERE codigo_producto = $1 AND VENDEDOR_codigo_vendedore = $2`,
      [id, VENDEDOR_ID]
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
      [id, VENDEDOR_ID]
    );

    await client.query("COMMIT");
    await logEventoModel.createLog({
      usuarioId: VENDEDOR_ID,
      accion: "DELETE",
      tabla: "PRODUCTOS",
      campo: "ALL",
      valorAnterior: JSON.stringify(oldProd),
      valorNuevo: null,
      contexto: { vendedor: VENDEDOR_ID, portal: PORTAL_CODE },
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
