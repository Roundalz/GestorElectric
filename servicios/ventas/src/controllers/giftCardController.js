// servicios/nuevoServicio/src/controllers/giftCardController.js
const giftCardService = require('../services/giftCardService');

async function crearGiftCard(req, res, next) {
    try {
        const { vendedorId } = req;
        const ipOrigen = req.ip;
        const nuevaGiftCard = await giftCardService.crearGiftCard(req.body, vendedorId, ipOrigen);
        res.status(201).json(nuevaGiftCard);
    } catch (err) {
        next(err);
    }
}

async function listarGiftCards(req, res, next) {
    try {
        const { vendedorId } = req;
        const giftCards = await giftCardService.listarGiftCards(vendedorId);
        res.json(giftCards);
    } catch (err) {
        next(err);
    }
}

async function actualizarGiftCard(req, res, next) {
    try {
        const { vendedorId } = req;
        const ipOrigen = req.ip;
        const { id } = req.params;
        const updatedGiftCard = await giftCardService.actualizarGiftCard(id, req.body, vendedorId, ipOrigen);
        res.json(updatedGiftCard);
    } catch (err) {
        next(err);
    }
}

async function eliminarGiftCard(req, res, next) {
    try {
        const { vendedorId } = req;
        const ipOrigen = req.ip;
        const { id } = req.params;
        await giftCardService.eliminarGiftCard(id, vendedorId, ipOrigen);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    crearGiftCard,
    listarGiftCards,
    actualizarGiftCard,
    eliminarGiftCard,
};
