const axios = require('axios');
const BASE_URL = process.env.MICRO_PRODUCTOS_URL || 'http://gestorelectric-productos:3001';

exports.listar = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/productos`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.obtener = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/productos/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
};

exports.crear = async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL}/productos`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const response = await axios.put(`${BASE_URL}/productos/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar producto' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await axios.delete(`${BASE_URL}/productos/${req.params.id}`);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar producto' });
  }
};
