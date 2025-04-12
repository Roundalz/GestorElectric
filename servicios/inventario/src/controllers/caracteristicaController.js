// controllers/caracteristicaController.js
import caracteristicaService from '../services/caracteristicaService.js';

export const getAllCaracteristicasByProducto = async (req, res) => {
  try {
    const productoId = req.params.productoId;
    const caracteristicas = await caracteristicaService.getCaracteristicasByProductoId(productoId);
    res.json(caracteristicas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener características', details: error.message });
  }
};

export const createCaracteristica = async (req, res) => {
  try {
    const nuevaCaracteristica = await caracteristicaService.createCaracteristica(req.body);
    res.status(201).json(nuevaCaracteristica);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear característica', details: error.message });
  }
};

export const updateCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    const caracteristicaActualizada = await caracteristicaService.updateCaracteristica(id, req.body);
    if (!caracteristicaActualizada)
      return res.status(404).json({ message: 'Característica no encontrada' });
    res.json(caracteristicaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar característica', details: error.message });
  }
};

export const deleteCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    await caracteristicaService.deleteCaracteristica(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar característica', details: error.message });
  }
};

export default {
  getAllCaracteristicasByProducto,
  createCaracteristica,
  updateCaracteristica,
  deleteCaracteristica
};
