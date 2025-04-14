// src/controllers/inventarioController.js
import axios from "axios";

const INVENTARIO_SERVICE_URL = process.env.INVENTARIO_SERVICE_URL || "http://inventario:3001";

// Listar productos: Se espera que el microservicio filtre productos por el vendedor (por ejemplo, 1)
export const getAllProductos = async (req, res) => {
  try {
    const response = await axios.get(`${INVENTARIO_SERVICE_URL}/inventario`);
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener productos:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener productos", details: error.message });
  }
};

// Obtener el detalle de un producto, con sus características e imágenes
export const getProductoDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${INVENTARIO_SERVICE_URL}/inventario/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener detalle del producto:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener detalle del producto", details: error.message });
  }
};

// Crear un nuevo producto (incluyendo características e imágenes)
export const createProducto = async (req, res) => {
  try {
    const response = await axios.post(`${INVENTARIO_SERVICE_URL}/inventario`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error al crear producto:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al crear producto", details: error.message });
  }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${INVENTARIO_SERVICE_URL}/inventario/${id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error al actualizar producto:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al actualizar producto", details: error.message });
  }
};

// Eliminar un producto y sus registros relacionados
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${INVENTARIO_SERVICE_URL}/inventario/${id}`);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar producto:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al eliminar producto", details: error.message });
  }
};

export default {
  getAllProductos,
  getProductoDetail,
  createProducto,
  updateProducto,
  deleteProducto,
};
