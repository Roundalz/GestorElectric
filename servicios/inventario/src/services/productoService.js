// services/productoService.js
import productoModel from '../models/productoModel.js';
import caracteristicaModel from '../models/caracteristicaModel.js';
import imgProductoModel from '../models/imgProductoModel.js';

export const getAllProductos = async () => {
  const productos = await productoModel.getAllProductos();
  // Agregar para cada producto sus características e imágenes.
  for (let producto of productos) {
    producto.caracteristicas = await caracteristicaModel.getCaracteristicasByProductoId(producto.codigo_producto);
    producto.imagenes = await imgProductoModel.getImgsByProductoId(producto.codigo_producto);
  }
  return productos;
};

export const getProductoById = async (id) => {
  const producto = await productoModel.getProductoById(id);
  if (producto) {
    producto.caracteristicas = await caracteristicaModel.getCaracteristicasByProductoId(producto.codigo_producto);
    producto.imagenes = await imgProductoModel.getImgsByProductoId(producto.codigo_producto);
  }
  return producto;
};

export const createProducto = async (data) => {
  try {
    const nuevoProducto = await productoModel.createProducto(data);
    console.log("Producto creado:", nuevoProducto);

    if (data.caracteristicas && Array.isArray(data.caracteristicas)) {
      nuevoProducto.caracteristicas = [];
      for (let caract of data.caracteristicas) {
        caract.PRODUCTOS_codigo_producto = nuevoProducto.codigo_producto;
        const nuevaCaract = await caracteristicaModel.createCaracteristica(caract);
        console.log("Característica insertada:", nuevaCaract);
        nuevoProducto.caracteristicas.push(nuevaCaract);
      }
    }
    
    if (data.imagenes && Array.isArray(data.imagenes)) {
      nuevoProducto.imagenes = [];
      for (let img of data.imagenes) {
        img.PRODUCTOS_codigo_producto = nuevoProducto.codigo_producto;
        const nuevaImg = await imgProductoModel.createImgProducto(img);
        console.log("Imagen insertada:", nuevaImg);
        nuevoProducto.imagenes.push(nuevaImg);
      }
    }
    return nuevoProducto;
  } catch (error) {
    console.error("Error en createProducto:", error);
    throw error;
  }
};


export const updateProducto = async (id, data) => {
  // Actualizamos solo los campos del producto; la actualización de características
  // e imágenes podría manejarse en endpoints separados.
  const productoActualizado = await productoModel.updateProducto(id, data);
  return productoActualizado;
};

export const deleteProducto = async (id) => {
  await productoModel.deleteProducto(id);
};

// Exportación por defecto para poder importarlo de forma única
export default { 
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
