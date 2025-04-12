import productoService from '../services/productoService.js';

export const getAllProductos = async (req, res) => {
  try {
    const productos = await productoService.getAllProductos();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const producto = await productoService.getProductoById(req.params.id);
    if (!producto)
      return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const createProducto = async (req, res) => {
  try {
    const nuevoProducto = await productoService.createProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await productoService.updateProducto(
      req.params.id,
      req.body
    );
    if (!productoActualizado)
      return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(productoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    await productoService.deleteProducto(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Exportación por defecto para que se pueda importar de forma única
export default {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};
