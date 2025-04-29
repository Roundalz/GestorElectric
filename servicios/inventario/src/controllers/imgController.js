import imageService from "../services/imgService.js";

/**
 * Controlador para rutas relacionadas con IMG_PRODUCTO de un PRODUCTO.
 */

/**
 * POST /productos/:productId/imagenes
 * Reemplaza todas las imágenes de un producto.
 */
export async function setImages(req, res) {
  try {
    const productId = Number(req.params.productId);
    const images = req.body;
    const result = await imageService.setImages(productId, images);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en setImages:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * GET /productos/:productId/imagenes
 * Obtiene todas las imágenes asociadas a un producto.
 */
export async function getImagesByProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    const images = await imageService.getImagesByProduct(productId);
    return res.status(200).json(images);
  } catch (error) {
    console.error("Error en getImagesByProduct:", error);
    return res.status(500).json({ error: "Error al obtener imágenes" });
  }
}

/**
 * PUT /imagenes/:imgId
 * Actualiza datos de una imagen específica.
 */
export async function updateImage(req, res) {
  try {
    const imgId = req.params.imgId;
    const data = req.body;
    const updated = await imageService.updateImage(imgId, data);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error en updateImage:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * DELETE /productos/:productId/imagenes
 * Elimina todas las imágenes de un producto.
 */
export async function deleteImagesByProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    const deleted = await imageService.deleteImagesByProduct(productId);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error en deleteImagesByProduct:", error);
    return res.status(400).json({ error: error.message });
  }
}

export default {
  setImages,
  getImagesByProduct,
  updateImage,
  deleteImagesByProduct,
};