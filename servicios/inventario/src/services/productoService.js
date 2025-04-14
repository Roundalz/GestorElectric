// services/productoService.js
import productoModel from "../models/productoModel.js";
import caracteristicaModel from "../models/caracteristicaModel.js";
import imgProductoModel from "../models/imgProductoModel.js";
import logEventoModel from "../models/logEventoModel.js";

export const createProducto = async (data, vendedorId = 1, logData = {}) => {
  // Registrar el intento de crear un producto
  await logEventoModel.createLogEvento({
    usuario_id: vendedorId,
    accion: "Crear producto",
    ip_origen: logData.ip || "0.0.0.0"
  });
  
  // Crear el producto
  const nuevoProducto = await productoModel.createProducto(data);
  
  // Agregar Características
  if (data.caracteristicas && Array.isArray(data.caracteristicas)) {
    nuevoProducto.caracteristicas = [];
    for (let caract of data.caracteristicas) {
      caract.PRODUCTOS_codigo_producto = nuevoProducto.codigo_producto;
      const nuevaCaract = await caracteristicaModel.createCaracteristica(caract);
      nuevoProducto.caracteristicas.push(nuevaCaract);
    }
  }
  
  // Agregar Imágenes
  if (data.imagenes && Array.isArray(data.imagenes)) {
    nuevoProducto.imagenes = [];
    for (let img of data.imagenes) {
      img.PRODUCTOS_codigo_producto = nuevoProducto.codigo_producto;
      const nuevaImg = await imgProductoModel.createImgProducto(img);
      nuevoProducto.imagenes.push(nuevaImg);
    }
  }
  
  return nuevoProducto;
};

export const getProductos = async (vendedorId = 1, logData = {}) => {
  await logEventoModel.createLogEvento({
    usuario_id: vendedorId,
    accion: "Listar productos",
    ip_origen: logData.ip || "0.0.0.0"
  });
  const productos = await productoModel.getAllProductosByVendedor(vendedorId);
  return productos;
};

export const getProductoDetail = async (id, vendedorId = 1, logData = {}) => {
  await logEventoModel.createLogEvento({
    usuario_id: vendedorId,
    accion: `Ver detalle producto ${id}`,
    ip_origen: logData.ip || "0.0.0.0"
  });
  const producto = await productoModel.getProductoByIdAndVendedor(id, vendedorId);
  if (producto) {
    const caracteristicas = await caracteristicaModel.getCaracteristicasByProductoId(id);
    const imagenes = await imgProductoModel.getImgsByProductoId(id);
    producto.caracteristicas = caracteristicas;
    producto.imagenes = imagenes;
  }
  return producto;
};

export const updateProducto = async (id, data, logData = {}) => {
  await logEventoModel.createLogEvento({
    usuario_id: data.VENDEDOR_codigo_vendedore || 1,
    accion: `Editar producto ${id}`,
    ip_origen: logData.ip || "0.0.0.0"
  });
  const productoActualizado = await productoModel.updateProducto(id, data);
  return productoActualizado;
};

export const deleteProducto = async (id, vendedorId = 1, logData = {}) => {
  await logEventoModel.createLogEvento({
    usuario_id: vendedorId,
    accion: `Eliminar producto ${id}`,
    ip_origen: logData.ip || "0.0.0.0"
  });
  await productoModel.deleteProducto(id);
};

export default {
  createProducto,
  getProductos,
  getProductoDetail,
  updateProducto,
  deleteProducto
};
