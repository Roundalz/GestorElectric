// servicios/nuevoServicio/src/services/giftCardService.js
const giftCardModel = require('../models/giftCardModel');
const logEventoModel = require('../models/logEventoModel');

async function crearGiftCard(data, vendedorId, ipOrigen) {
    const newGiftCard = await giftCardModel.crearGiftCard({ ...data, vendedorId });
    await logEventoModel.registrarLog(vendedorId, `Creó GiftCard ${newGiftCard.clave_gift_card}`, ipOrigen);
    return newGiftCard;
}

async function listarGiftCards(vendedorId) {
    return await giftCardModel.listarGiftCards(vendedorId);
}

async function actualizarGiftCard(id, data, vendedorId, ipOrigen) {
    const updatedGiftCard = await giftCardModel.actualizarGiftCard(id, data);
    await logEventoModel.registrarLog(vendedorId, `Actualizó GiftCard ${updatedGiftCard.clave_gift_card}`, ipOrigen);
    return updatedGiftCard;
}

async function eliminarGiftCard(id, vendedorId, ipOrigen) {
    await giftCardModel.eliminarGiftCard(id);
    await logEventoModel.registrarLog(vendedorId, `Eliminó GiftCard ID ${id}`, ipOrigen);
}

module.exports = {
    crearGiftCard,
    listarGiftCards,
    actualizarGiftCard,
    eliminarGiftCard,
};
