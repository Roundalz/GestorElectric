// servicios/inventario/src/models/imgProductoModel.js
import pool from "../database.js";
import { v4 as uuidv4 } from "uuid";
import logEventoModel from "./logEventoModel.js";

export async function setImages(productId, images, vendedorId) {
  const client = await pool.connect();
  try {
    const planRes = await client.query(
      `SELECT p.codigo_plan FROM VENDEDOR v JOIN PLANES_PAGO p ON v.PLANES_PAGO_codigo_plan = p.codigo_plan WHERE v.codigo_vendedore = $1`,
      [vendedorId]
    );
    if (!planRes.rowCount) throw new Error("Plan de pago no encontrado");
    const { codigo_plan } = planRes.rows[0];
    const allowedImages = codigo_plan * 2;

    if (images.length > allowedImages) {
      throw new Error(`Máximo de ${allowedImages} imágenes permitidas.`);
    }

    await client.query("BEGIN");

    const { rows: oldImages } = await client.query(
      `SELECT primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`,
      [productId]
    );

    await client.query(
      `DELETE FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`,
      [productId]
    );

    for (const img of images) {
      const codigoImg = uuidv4();
      await client.query(
        `INSERT INTO IMG_PRODUCTO (codigo_img_producto, primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo, PRODUCTOS_codigo_producto)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [codigoImg, img.primer_angulo, img.segundo_angulo, img.tercer_angulo, img.cuarto_angulo, productId]
      );
    }

    await client.query("COMMIT");

    await logEventoModel.createLog({
      usuarioId: vendedorId,
      accion: "UPDATE",
      tabla: "IMG_PRODUCTO",
      campo: "ALL",
      valorAnterior: JSON.stringify(oldImages),
      valorNuevo: JSON.stringify(images),
      contexto: { vendedor: vendedorId, portal: null }
    });

    return { old: oldImages, new: images };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getImagesByProduct(productId) {
  const { rows } = await pool.query(
    `SELECT codigo_img_producto, primer_angulo, segundo_angulo, tercer_angulo, cuarto_angulo FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1 ORDER BY codigo_img_producto`,
    [productId]
  );
  return rows;
}

export async function deleteImagesByProduct(productId, vendedorId) {
  const { rows: oldImages } = await pool.query(
    `SELECT * FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`,
    [productId]
  );
  await pool.query(
    `DELETE FROM IMG_PRODUCTO WHERE PRODUCTOS_codigo_producto = $1`,
    [productId]
  );

  await logEventoModel.createLog({
    usuarioId: vendedorId,
    accion: "DELETE",
    tabla: "IMG_PRODUCTO",
    campo: "ALL",
    valorAnterior: JSON.stringify(oldImages),
    valorNuevo: null,
    contexto: { vendedor: vendedorId, portal: null }
  });

  return oldImages;
}

export async function updateImage(imgId, data, vendedorId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: [oldImg] } = await client.query(
      `SELECT * FROM IMG_PRODUCTO WHERE codigo_img_producto = $1`,
      [imgId]
    );
    if (!oldImg) throw new Error("Imagen no encontrada");

    const fields = [], values = [];
    let idx = 1;
    for (const key of ["primer_angulo", "segundo_angulo", "tercer_angulo", "cuarto_angulo"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }

    if (!fields.length) throw new Error("No hay datos para actualizar");
    values.push(imgId);

    const updateQuery = `
      UPDATE IMG_PRODUCTO SET ${fields.join(", ")}
      WHERE codigo_img_producto = $${idx}
      RETURNING *
    `;

    const { rows: [updatedImg] } = await client.query(updateQuery, values);

    await client.query("COMMIT");

    for (const field of Object.keys(data)) {
      if (data[field] !== oldImg[field]) {
        await logEventoModel.createLog({
          usuarioId: vendedorId,
          accion: "UPDATE",
          tabla: "IMG_PRODUCTO",
          campo: field,
          valorAnterior: oldImg[field],
          valorNuevo: updatedImg[field],
          contexto: { vendedor: vendedorId, portal: null }
        });
      }
    }

    return updatedImg;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export default {
  setImages,
  getImagesByProduct,
  deleteImagesByProduct,
  updateImage
};
