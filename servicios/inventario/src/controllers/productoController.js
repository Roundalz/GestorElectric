// controllers/productoController.js
import productoService from "../services/productoService.js";
import { exportProductosExcel } from "../utils/excelExport.js";

const VENDEDOR_ID = 1; // Para ejemplo, vendedor 1

export const createProducto = async (req, res) => {
  try {
    const producto = await productoService.createProducto(req.body, VENDEDOR_ID, { ip: req.ip });
    res.status(201).json(producto);
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    res.status(500).json({ error: "Error al crear producto", details: error.message });
  }
};

export const getProductos = async (req, res) => {
  try {
    const productos = await productoService.getProductos(VENDEDOR_ID, { ip: req.ip });
    res.json(productos);
  } catch (error) {
    console.error("Error al listar productos:", error.message);
    res.status(500).json({ error: "Error al listar productos", details: error.message });
  }
};

export const getProductoDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoService.getProductoDetail(id, VENDEDOR_ID, { ip: req.ip });
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener detalle del producto:", error.message);
    res.status(500).json({ error: "Error al obtener detalle del producto", details: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoService.updateProducto(id, req.body, { ip: req.ip });
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    res.status(500).json({ error: "Error al actualizar producto", details: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await productoService.deleteProducto(id, VENDEDOR_ID, { ip: req.ip });
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    res.status(500).json({ error: "Error al eliminar producto", details: error.message });
  }
};
export const exportProductos = async (req, res) => {
    try {
      // Asumir que getProductos devuelve los productos del vendedor 1
      const productos = await productoService.getProductos(1, { ip: req.ip });
      const workbook = await exportProductosExcel(productos);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=productos.xlsx"
      );
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error exportando productos:", error.message);
      res.status(500).json({ error: "Error exportando productos", details: error.message });
    }
  };

export default {
  createProducto,
  getProductos,
  getProductoDetail,
  updateProducto,
  deleteProducto,
  exportProductos
};
