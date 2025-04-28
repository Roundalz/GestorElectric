// servicios/nuevoServicio/src/models/giftCardModel.js
import db from '../db.js'; 

async function crearGiftCard({ clave, fecha_expiracion, porcentaje, estado, vendedorId }) {
  const query = `
    INSERT INTO GIFT_CARDS (clave_gift_card, fecha_expiracion_gift_card, porcentaje_gift_card, estado_gift_card, VENDEDOR_codigo_vendedore)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [clave, fecha_expiracion, porcentaje, estado, vendedorId];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function listarGiftCards(vendedorId) {
  const query = `
    SELECT *
    FROM GIFT_CARDS
    WHERE VENDEDOR_codigo_vendedore = $1
    ORDER BY fecha_expiracion_gift_card ASC
  `;
  const { rows } = await db.query(query, [vendedorId]);
  return rows;
}

async function actualizarGiftCard(id, { clave, fecha_expiracion, porcentaje, estado }) {
  const query = `
    UPDATE GIFT_CARDS
    SET clave_gift_card = $1,
        fecha_expiracion_gift_card = $2,
        porcentaje_gift_card = $3,
        estado_gift_card = $4
    WHERE codigo_gift_card = $5
    RETURNING *
  `;
  const values = [clave, fecha_expiracion, porcentaje, estado, id];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function eliminarGiftCard(id) {
  const query = `
    DELETE FROM GIFT_CARDS
    WHERE codigo_gift_card = $1
  `;
  await db.query(query, [id]);
}

export default {
  crearGiftCard,
  listarGiftCards,
  actualizarGiftCard,
  eliminarGiftCard,
};