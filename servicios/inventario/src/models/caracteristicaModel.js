// servicios/inventario/src/models/caracteristicaModel.js
import pool from "../database.js";
import logEventoModel from "./logEventoModel.js";

/**
 * Modelo para CRUD de CARACTERISTICAS ligadas a PRODUCTOS
 * Validando por vendedor.
 */

export async function setCharacteristics(productId, chars, vendedorId) {
  const client = await pool.connect();
  try {
    const planRes = await client.query(
      `SELECT p.codigo_plan
         FROM VENDEDOR v
         JOIN PLANES_PAGO p ON v.PLANES_PAGO_codigo_plan = p.codigo_plan
        WHERE v.codigo_vendedore = $1`,
      [vendedorId]
    );
    if (!planRes.rowCount) throw new Error("Plan de pago no encontrado");
    const { codigo_plan } = planRes.rows[0];
    const allowedChars = codigo_plan * 2;

    if (chars.length > allowedChars) {
      throw new Error(`Máximo de ${allowedChars} características permitidas.`);
    }

    await client.query("BEGIN");

    const { rows: oldChars } = await client.query(
      `SELECT nombre_caracteristica, descripcion_caracteristica
         FROM CARACTERISTICAS
        WHERE PRODUCTOS_codigo_producto = $1`,
      [productId]
    );

    await client.query(`DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`, [productId]);

    for (const char of chars) {
      await client.query(
        `INSERT INTO CARACTERISTICAS (nombre_caracteristica, descripcion_caracteristica, PRODUCTOS_codigo_producto)
         VALUES ($1, $2, $3)`,
        [char.nombre_caracteristica, char.descripcion_caracteristica, productId]
      );
    }

    await client.query("COMMIT");

    await logEventoModel.createLog({
      usuarioId: vendedorId,
      accion: "UPDATE",
      tabla: "CARACTERISTICAS",
      campo: "ALL",
      valorAnterior: JSON.stringify(oldChars),
      valorNuevo: JSON.stringify(chars),
      contexto: { vendedor: vendedorId, portal: null }
    });

    return { old: oldChars, new: chars };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getCharacteristicsByProduct(productId) {
  const { rows } = await pool.query(
    `SELECT codigo_caracteristica, nombre_caracteristica, descripcion_caracteristica
      FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1
     ORDER BY codigo_caracteristica`,
    [productId]
  );
  return rows;
}

export async function deleteCharacteristicsByProduct(productId, vendedorId) {
  const { rows: oldChars } = await pool.query(
    `SELECT * FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
    [productId]
  );
  await pool.query(
    `DELETE FROM CARACTERISTICAS WHERE PRODUCTOS_codigo_producto = $1`,
    [productId]
  );

  await logEventoModel.createLog({
    usuarioId: vendedorId,
    accion: "DELETE",
    tabla: "CARACTERISTICAS",
    campo: "ALL",
    valorAnterior: JSON.stringify(oldChars),
    valorNuevo: null,
    contexto: { vendedor: vendedorId, portal: null }
  });

  return oldChars;
}

export async function updateCharacteristic(id, data, vendedorId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: [oldChar] } = await client.query(
      `SELECT * FROM CARACTERISTICAS WHERE codigo_caracteristica = $1`,
      [id]
    );
    if (!oldChar) throw new Error("Característica no encontrada");

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
       RETURNING *`;

    const { rows: [updated] } = await client.query(updateQuery, values);
    await client.query("COMMIT");

    for (const field of Object.keys(data)) {
      if (data[field] !== oldChar[field]) {
        await logEventoModel.createLog({
          usuarioId: vendedorId,
          accion: "UPDATE",
          tabla: "CARACTERISTICAS",
          campo: field,
          valorAnterior: oldChar[field],
          valorNuevo: updated[field],
          contexto: { vendedor: vendedorId, portal: null }
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
