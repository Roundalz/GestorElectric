// servicios/inventario/src/services/productoService.js
import * as productModel from "../models/productoModel.js";

/**
 * productService: Orquesta la lógica de negocio para productos,
 * asegurando siempre que vendedorId sea un número válido.
 */

function validateVendedorId(vendedorId) {
  const id = Number(vendedorId);
  if (!id || isNaN(id)) {
    const error = new Error('VendedorId inválido');
    error.status = 400;
    throw error;
  }
  return id;
}

export async function createProduct(data, vendedorId) {
  const validVendedorId = validateVendedorId(vendedorId);
  return await productModel.createProduct(data, validVendedorId);
}

export async function getAllProducts(vendedorId) {
  const validVendedorId = validateVendedorId(vendedorId);
  return await productModel.getAllProducts(validVendedorId);
}

export async function getProductById(id, vendedorId) {
  const validVendedorId = validateVendedorId(vendedorId);
  return await productModel.getProductById(id, validVendedorId);
}

export async function getProductsByName(name, vendedorId) {
  const validVendedorId = validateVendedorId(vendedorId);
  return await productModel.getProductsByName(name, validVendedorId);
}

export async function updateProduct(id, data, vendedorId) {
  const validVendedorId = validateVendedorId(vendedorId);
  return await productModel.updateProduct(id, data, validVendedorId);
}

export async function updateQuantity(id, newQuantity, vendedorId) {
  const validVendedorId = validateVendedorId(vendedorId);
  return await productModel.updateQuantity(id, newQuantity, validVendedorId);
}

export async function deleteProduct(id, vendedorId) {
  const validVendedorId = validateVendedorId(vendedorId);
  await productModel.deleteProduct(id, validVendedorId);
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
