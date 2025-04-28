import * as imgModel from "../models/imgProductoModel.js";

/**
 * imageService: maneja la lógica de negocio para IMG_PRODUCTO
 * delegando en imgProductoModel.
 */

/**
 * Establece un conjunto de imágenes para un producto, reemplazando las existentes.
 * @param {number} productId
 * @param {Array<{ primer_angulo: string, segundo_angulo: string, tercer_angulo: string, cuarto_angulo: string }>} images
 * @returns {Object} { old, new }
 */
export async function setImages(productId, images) {
  // TODO: validar que productId exista (opcional)
  const result = await imgModel.setImages(productId, images);
  return result;
}

/**
 * Obtiene todas las imágenes de un producto.
 * @param {number} productId
 * @returns {Array<Object>} Lista de imágenes
 */
export async function getImagesByProduct(productId) {
  const images = await imgModel.getImagesByProduct(productId);
  return images;
}

/**
 * Elimina todas las imágenes de un producto.
 * @param {number} productId
 * @returns {Array<Object>} Imágenes eliminadas (antes del borrado)
 */
export async function deleteImagesByProduct(productId) {
  const deleted = await imgModel.deleteImagesByProduct(productId);
  return deleted;
}

/**
 * Actualiza campos de una imagen específica.
 * @param {string} imgId
 * @param {{ primer_angulo?: string, segundo_angulo?: string, tercer_angulo?: string, cuarto_angulo?: string }} data
 * @returns {Object} Imagen actualizada
 */
export async function updateImage(imgId, data) {
  const updatedImg = await imgModel.updateImage(imgId, data);
  return updatedImg;
}

export default {
  setImages,
  getImagesByProduct,
  deleteImagesByProduct,
  updateImage,
};
