import characteristicService from "../services/caracteristicaService.js";

/**
 * Controlador para rutas relacionadas con CARACTERISTICAS de un PRODUCTO.
 */

/**
 * POST /productos/:productId/caracteristicas
 * Reemplaza todas las características de un producto.
 */
export async function setCharacteristics(req, res) {
  try {
    const productId = Number(req.params.productId);
    const chars = req.body;
    const result = await characteristicService.setCharacteristics(productId, chars);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en setCharacteristics:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * GET /productos/:productId/caracteristicas
 * Obtiene todas las características asociadas a un producto.
 */
export async function getCharacteristicsByProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    const characteristics = await characteristicService.getCharacteristicsByProduct(productId);
    return res.status(200).json(characteristics);
  } catch (error) {
    console.error("Error en getCharacteristicsByProduct:", error);
    return res.status(500).json({ error: "Error al obtener características" });
  }
}

/**
 * PUT /caracteristicas/:charId
 * Actualiza datos de una característica específica.
 */
export async function updateCharacteristic(req, res) {
  try {
    const charId = Number(req.params.charId);
    const data = req.body;
    const updated = await characteristicService.updateCharacteristic(charId, data);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error en updateCharacteristic:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * DELETE /productos/:productId/caracteristicas
 * Elimina todas las características de un producto.
 */
export async function deleteCharacteristicsByProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    const deleted = await characteristicService.deleteCharacteristicsByProduct(productId);
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
