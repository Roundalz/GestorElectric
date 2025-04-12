// controllers/imgProductoController.js
import imgProductoService from '../services/imgProductoService.js';

export const getAllImgsByProducto = async (req, res) => {
  try {
    const productoId = req.params.productoId;
    const imagenes = await imgProductoService.getImgsByProductoId(productoId);
    res.json(imagenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener imágenes', details: error.message });
  }
};

export const createImgProducto = async (req, res) => {
  try {
    const nuevaImagen = await imgProductoService.createImgProducto(req.body);
    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear imagen', details: error.message });
  }
};

export const updateImgProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const imagenActualizada = await imgProductoService.updateImgProducto(id, req.body);
    if (!imagenActualizada) return res.status(404).json({ message: 'Imagen no encontrada' });
    res.json(imagenActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar imagen', details: error.message });
  }
};

export const deleteImgProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await imgProductoService.deleteImgProducto(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar imagen', details: error.message });
  }
};

export default {
  getAllImgsByProducto,
  createImgProducto,
  updateImgProducto,
  deleteImgProducto
};
