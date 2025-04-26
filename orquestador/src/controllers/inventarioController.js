import axios from 'axios';

// URL base del microservicio de Inventario
const INVENTARIO_BASE_URL = process.env.INVENTARIO_SERVICE_URL || 'http://localhost:3001/inventario';

console.log('⏩ Orquestador está proxy a:', INVENTARIO_BASE_URL);
/**
 * Controlador que delega llamadas al microservicio de inventario
 */

// CRUD Productos
export async function createProduct(req, res) {
  try {
    const response = await axios.post(`${INVENTARIO_BASE_URL}/productos`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function getProducts(req, res) {
  try {
    const response = await axios.get(`${INVENTARIO_BASE_URL}/productos`, { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const response = await axios.get(`${INVENTARIO_BASE_URL}/productos/${id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const response = await axios.put(`${INVENTARIO_BASE_URL}/productos/${id}`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function updateQuantity(req, res) {
  try {
    const { id } = req.params;
    const response = await axios.patch(
      `${INVENTARIO_BASE_URL}/productos/${id}/cantidad`,
      { cantidad: req.body.cantidad }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${INVENTARIO_BASE_URL}/productos/${id}`);
    res.sendStatus(response.status);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

// Características
export async function setCharacteristics(req, res) {
  try {
    const { productId } = req.params;
    const response = await axios.post(
      `${INVENTARIO_BASE_URL}/productos/${productId}/caracteristicas`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function getCharacteristics(req, res) {
  try {
    const { productId } = req.params;
    const response = await axios.get(
      `${INVENTARIO_BASE_URL}/productos/${productId}/caracteristicas`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function updateCharacteristic(req, res) {
  try {
    const { charId } = req.params;
    const response = await axios.put(
      `${INVENTARIO_BASE_URL}/caracteristicas/${charId}`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function deleteCharacteristics(req, res) {
  try {
    const { productId } = req.params;
    const response = await axios.delete(
      `${INVENTARIO_BASE_URL}/productos/${productId}/caracteristicas`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

// Imágenes
export async function setImages(req, res) {
  try {
    const { productId } = req.params;
    const response = await axios.post(
      `${INVENTARIO_BASE_URL}/productos/${productId}/imagenes`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function getImages(req, res) {
  try {
    const { productId } = req.params;
    const response = await axios.get(
      `${INVENTARIO_BASE_URL}/productos/${productId}/imagenes`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function updateImage(req, res) {
  try {
    const { imgId } = req.params;
    const response = await axios.put(
      `${INVENTARIO_BASE_URL}/imagenes/${imgId}`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

export async function deleteImages(req, res) {
  try {
    const { productId } = req.params;
    const response = await axios.delete(
      `${INVENTARIO_BASE_URL}/productos/${productId}/imagenes`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    res.status(status).json({ error: message });
  }
}

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
  deleteImages
};