// orquestador/src/controllers/inventarioController.js
import axios from 'axios';
import { getVendedorId } from '../utils/getVendedorId.js';

const INVENTARIO_BASE_URL = process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001/inventario';

console.log('⏩ Proxy Orquestador hacia Inventario en:', INVENTARIO_BASE_URL);

async function handleRequest(req, res, method, endpoint, data = {}, params = {}) {
  const vendedorId = getVendedorId(req);
  if (!vendedorId || !Number.isInteger(vendedorId)) {
    return res.status(400).json({ error: 'Vendedor ID inválido u obligatorio' });
  }

  const config = {
    method,
    url: `${INVENTARIO_BASE_URL}${endpoint}`,
    params,
    headers: {
      'Content-Type': 'application/json',
      'X-Vendedor-Id': vendedorId.toString(),
    },
  };

  if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message || 'Error desconocido';
    res.status(status).json({ error: message });
  }
}

// Productos
export const createProduct = (req, res) => handleRequest(req, res, 'post', '/productos', req.body);
export const getProducts = (req, res) => handleRequest(req, res, 'get', '/productos', {}, req.query);
export const getProductById = (req, res) => handleRequest(req, res, 'get', `/productos/${req.params.id}`);
export const updateProduct = (req, res) => handleRequest(req, res, 'put', `/productos/${req.params.id}`, req.body);
export const updateQuantity = (req, res) => handleRequest(req, res, 'patch', `/productos/${req.params.id}/cantidad`, { cantidad: req.body.cantidad });
export const deleteProduct = (req, res) => handleRequest(req, res, 'delete', `/productos/${req.params.id}`);

// Características
export const setCharacteristics = (req, res) => handleRequest(req, res, 'post', `/productos/${req.params.productId}/caracteristicas`, req.body);
export const getCharacteristics = (req, res) => handleRequest(req, res, 'get', `/productos/${req.params.productId}/caracteristicas`);
export const updateCharacteristic = (req, res) => handleRequest(req, res, 'put', `/caracteristicas/${req.params.charId}`, req.body);
export const deleteCharacteristics = (req, res) => handleRequest(req, res, 'delete', `/productos/${req.params.productId}/caracteristicas`);

// Imágenes
export const setImages = (req, res) => handleRequest(req, res, 'post', `/productos/${req.params.productId}/imagenes`, req.body);
export const getImages = (req, res) => handleRequest(req, res, 'get', `/productos/${req.params.productId}/imagenes`);
export const updateImage = (req, res) => handleRequest(req, res, 'put', `/imagenes/${req.params.imgId}`, req.body);
export const deleteImages = (req, res) => handleRequest(req, res, 'delete', `/productos/${req.params.productId}/imagenes`);

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateQuantity,
  deleteProduct,
  setCharacteristics,
  getCharacteristics,
  updateCharacteristic,
  deleteCharacteristics,
  setImages,
  getImages,
  updateImage,
  deleteImages,
};
