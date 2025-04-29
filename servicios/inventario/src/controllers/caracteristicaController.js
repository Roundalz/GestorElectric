// servicios/inventario/src/controllers/caracteristicaController.js
import characteristicService from "../services/caracteristicaService.js";

/**
 * Controlador para rutas relacionadas con CARACTERISTICAS de un PRODUCTO.
 */

// POST /productos/:productId/caracteristicas
export async function setCharacteristics(req, res) {
  try {
    const productId = Number(req.params.productId);
    const { vendedorId } = req; // (1) Usar vendedorId
    const chars = req.body;
    const result = await characteristicService.setCharacteristics(productId, chars, vendedorId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en setCharacteristics:", error);
    return res.status(400).json({ error: error.message });
  }
}

// GET /productos/:productId/caracteristicas
export async function getCharacteristicsByProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    const { vendedorId } = req; // (2) Usar vendedorId
    const characteristics = await characteristicService.getCharacteristicsByProduct(productId, vendedorId);
    return res.status(200).json(characteristics);
  } catch (error) {
    console.error("Error en getCharacteristicsByProduct:", error);
    return res.status(500).json({ error: "Error al obtener características" });
  }
}

// PUT /caracteristicas/:charId
export async function updateCharacteristic(req, res) {
  try {
    const charId = Number(req.params.charId);
    const { vendedorId } = req; // (3) Usar vendedorId
    const data = req.body;
    const updated = await characteristicService.updateCharacteristic(charId, data, vendedorId);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error en updateCharacteristic:", error);
    return res.status(400).json({ error: error.message });
  }
}

// DELETE /productos/:productId/caracteristicas
export async function deleteCharacteristicsByProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    const { vendedorId } = req; // (4) Usar vendedorId
    const deleted = await characteristicService.deleteCharacteristicsByProduct(productId, vendedorId);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error en deleteCharacteristicsByProduct:", error);
    return res.status(400).json({ error: error.message });
  }
}

export default {
  setCharacteristics,
  getCharacteristicsByProduct,
  updateCharacteristic,
  deleteCharacteristicsByProduct,
};
