import * as productModel from "../models/productoModel.js";

/**
 * productService: orquesta la lógica de negocio para inventario/productos
 * delegando en productoModel y respetando las reglas de negocio.
 */

/**
 * Crea un nuevo producto junto con sus imágenes y características.
 * @param {Object} data  
 *  - nombre_producto, tipo_producto, precio_unidad_producto, cantidad_disponible_producto,
 *    imagen_referencia_producto, estado_producto, calificacion_producto, costo_producto,
 *    descuento_producto, caracteristicas: Array, imagenes: Array
 * @returns {Object} Registro del producto creado
 */
export async function createProduct(data) {
  // TODO: validar campos de entrada si se requiere (e.g. campos obligatorios)
  const product = await productModel.createProduct(data);
  return product;
}

/**
 * Recupera todos los productos del vendedor con sus detalles.
 * @returns {Array<Object>} Listado de productos
 */
export async function getAllProducts() {
  const products = await productModel.getAllProducts();
  return products;
}

/**
 * Recupera un producto específico por su ID.
 * @param {number} id
 * @returns {Object|null} Producto encontrado o null
 */
export async function getProductById(id) {
  const product = await productModel.getProductById(id);
  return product;
}

/**
 * Busca productos por nombre (coincidencia parcial).
 * @param {string} name
 * @returns {Array<Object>} Productos que coinciden
 */
export async function getProductsByName(name) {
  const products = await productModel.getProductsByName(name);
  return products;
}

/**
 * Actualiza campos de un producto y sus relaciones (imágenes/características).
 * @param {number} id
 * @param {Object} data  Nuevos valores para actualizar
 * @returns {Object} Producto actualizado
 */
export async function updateProduct(id, data) {
  // TODO: validar data (e.g. tipos, rangos)
  const updated = await productModel.updateProduct(id, data);
  return updated;
}

/**
 * Actualiza únicamente la cantidad disponible de un producto.
 * @param {number} id
 * @param {number} newQuantity
 * @returns {number} Nueva cantidad disponible
 */
export async function updateQuantity(id, newQuantity) {
  // TODO: validar newQuantity >= 0
  const qty = await productModel.updateQuantity(id, newQuantity);
  return qty;
}

/**
 * Elimina un producto y todo su contenido relacionado.
 * @param {number} id
 * @returns {void}
 */
export async function deleteProduct(id) {
  await productModel.deleteProduct(id);
}

export default {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByName,
  updateProduct,
  updateQuantity,
  deleteProduct,
};
