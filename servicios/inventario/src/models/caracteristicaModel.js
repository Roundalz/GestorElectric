import pool from "../database.js";
import { VENDEDOR_ID } from "../config.js";
import logEventoModel from "./logEventoModel.js";

/**
 * Modelo para CRUD de CARACTERISTICAS ligadas a PRODUCTOS,
 * con validación de límite por plan y registro de logs.
 */

/**
 * Agrega características a un producto. Reemplaza todas las existentes.
 * @param {number} productId
 * @param {Array<{ nombre_caracteristica: string, descripcion_caracteristica: string }>} chars
 */
export async function setCharacteristics(productId, chars) {
  const client = await pool.connect();
  try {
    // 1) Obtener plan del vendedor
    const planRes = await client.query(
      `SELECT p.codigo_plan, p.max_productos
         FROM VENDEDOR v
         JOIN PLANES_PAGO p ON v.PLANES_PAGO_codigo_plan = p.codigo_plan
        WHERE v.codigo_vendedore = $1`,
      [VENDEDOR_ID]
    );
    if (!planRes.rowCount) throw new Error("Plan de pago no encontrado");
    const { codigo_plan } = planRes.rows[0];
    const allowedChars = codigo_plan * 2;

    // 2) Validar límite
    if (chars.length > allowedChars) {
      throw new Error(
        `Máximo de ${allowedChars} características permitidas para tu plan (plan ${codigo_plan}).`
      );
    }

    await client.query("BEGIN");

    // 3) Leer características actuales para log
    const { rows: oldChars } = await client.query(
      `SELECT nombre_caracteristica, descripcion_caracteristica
         FROM CARACTERISTICAS
        WHERE PRODUCTOS_codigo_producto = $1`,
      [productId]
    );

    // 4) Borrar existentes
    await client.query(
      `DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
      [productId]
    );

    // 5) Insertar nuevas
    for (const char of chars) {
      await client.query(
        `INSERT INTO CARACTERISTICAS
           (nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto)
         VALUES ($1,$2,$3)`,
        [char.nombre_caracteristica, char.descripcion_caracteristica, productId]
      );
    }

    await client.query("COMMIT");

    // 6) Log detallado de actualización
    await logEventoModel.createLog({
      usuarioId: VENDEDOR_ID,
      accion: "UPDATE",
      tabla: "CARACTERISTICAS",
      campo: "ALL",
      valorAnterior: JSON.stringify(oldChars),
      valorNuevo: JSON.stringify(chars),
      contexto: { vendedor: VENDEDOR_ID, portal: null }
    });

    return { old: oldChars, new: chars };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Obtiene todas las características de un producto.
 * @param {number} productId
 */
export async function getCharacteristicsByProduct(productId) {
  const query = `
    SELECT codigo_caracteristica,
           nombre_caracteristica,
           descripcion_caracteristica
      FROM CARACTERISTICAS
     WHERE PRODUCTOS_codigo_producto = $1
     ORDER BY codigo_caracteristica;
  `;
  const { rows } = await pool.query(query, [productId]);
  return rows;
}

/**
 * Elimina todas las características de un producto.
 * @param {number} productId
 */
export async function deleteCharacteristicsByProduct(productId) {
  // Leer antes para log
  const { rows: oldChars } = await pool.query(
    `SELECT * FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
    [productId]
  );
  await pool.query(
    `DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
    [productId]
  );
  await logEventoModel.createLog({
    usuarioId: VENDEDOR_ID,
    accion: "DELETE",
    tabla: "CARACTERISTICAS",
    campo: "ALL",
    valorAnterior: JSON.stringify(oldChars),
    valorNuevo: null,
    contexto: { vendedor: VENDEDOR_ID, portal: null }
  });
  return oldChars;
}

/**
 * Actualiza una característica específica.
 * @param {number} id
 * @param {{ nombre_caracteristica?: string, descripcion_caracteristica?: string }} data
 */
export async function updateCharacteristic(id, data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: [oldChar] } = await client.query(
      `SELECT * FROM CARACTERISTICAS WHERE codigo_caracteristica = $1`,
      [id]
    );
    if (!oldChar) throw new Error("Característica no encontrada");

    // Campos dinámicos
    const fields = [], values = [];
    let idx = 1;
    for (const key of ["nombre_caracteristica", "descripcion_caracteristica"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }
    if (!fields.length) throw new Error("No hay datos para actualizar");
    values.push(id);

    const updateQuery = `
      UPDATE CARACTERISTICAS
         SET ${fields.join(", ")}
       WHERE codigo_caracteristica = $${idx}
       RETURNING *
    `;
    const { rows: [updated] } = await client.query(updateQuery, values);
    await client.query("COMMIT");

    // Log por cambios de campos
    for (const field of Object.keys(data)) {
      if (data[field] !== oldChar[field]) {
        await logEventoModel.createLog({
          usuarioId: VENDEDOR_ID,
          accion: "UPDATE",
          tabla: "CARACTERISTICAS",
          campo: field,
          valorAnterior: oldChar[field],
          valorNuevo: updated[field],
          contexto: { vendedor: VENDEDOR_ID, portal: null }
        });
      }
    }
    return updated;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export default {
  setCharacteristics,
  getCharacteristicsByProduct,
  deleteCharacteristicsByProduct,
  updateCharacteristic,
};