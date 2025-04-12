// Importa axios usando la sintaxis ES6
import axios from 'axios';

// Función para obtener todos los productos
export const getAllProductos = async (req, res) => {
  try {
    // Ejemplo: reenviar la solicitud al microservicio de inventario
    const response = await axios.get(`${process.env.INVENTARIO_SERVICE_URL || 'http://inventario:3001'}/inventario/productos`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos', details: error.message });
  }
};

// Función para obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.INVENTARIO_SERVICE_URL || 'http://inventario:3001'}/inventario/productos/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
};

// Función para crear un producto
export const createProducto = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.INVENTARIO_SERVICE_URL || 'http://inventario:3001'}/inventario/productos`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto', details: error.message });
  }
};

// Función para actualizar un producto
export const updateProducto = async (req, res) => {
  try {
    const response = await axios.put(`${process.env.INVENTARIO_SERVICE_URL || 'http://inventario:3001'}/inventario/productos/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
  }
};

// Función para eliminar un producto
export const deleteProducto = async (req, res) => {
  try {
    await axios.delete(`${process.env.INVENTARIO_SERVICE_URL || 'http://inventario:3001'}/inventario/productos/${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
};

// Exportación por defecto para que puedas importar de forma única
export default {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
