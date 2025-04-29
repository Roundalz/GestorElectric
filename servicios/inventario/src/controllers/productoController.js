// servicios/inventario/src/controllers/productoController.js
import productService from "../services/productoService.js";

/**
 * Controlador para rutas relacionadas con PRODUCTOS.
 */

// POST /productos → Crear producto
export async function createProduct(req, res) {
  try {
    const vendedorId = parseInt(req.headers['x-vendedor-id'], 10);
    if (!vendedorId || isNaN(vendedorId)) {
      return res.status(400).json({ error: 'VendedorId inválido' });
    }
    const newProduct = await productService.createProduct(req.body, vendedorId);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ error: error.message });
  }
}

// GET /productos → Obtener productos del vendedor
export async function getProducts(req, res) {
  try {
    const { name } = req.query;
    const { vendedorId } = req;

    let products;
    if (name) {
      products = await productService.getProductsByName(name, vendedorId);
    } else {
      products = await productService.getAllProducts(vendedorId);
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error en getProducts:", error);
    return res.status(500).json({ error: "Error al obtener productos" });
  }
}

// GET /productos/:id → Obtener producto específico
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const { vendedorId } = req;

    const product = await productService.getProductById(Number(id), vendedorId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error en getProductById:", error);
    return res.status(500).json({ error: "Error al obtener el producto" });
  }
}

// PUT /productos/:id → Actualizar producto
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { vendedorId, portalCode } = req;
    const data = { ...req.body, portalCode };

    const updated = await productService.updateProduct(Number(id), data, vendedorId);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error en updateProduct:", error);
    return res.status(400).json({ error: error.message });
  }
}

// PATCH /productos/:id/cantidad → Actualizar cantidad
export async function updateQuantity(req, res) {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    const { vendedorId } = req;

    const newQty = await productService.updateQuantity(Number(id), Number(cantidad), vendedorId);
    return res.status(200).json({ cantidad_disponible_producto: newQty });
  } catch (error) {
    console.error("Error en updateQuantity:", error);
    return res.status(400).json({ error: error.message });
  }
}

// DELETE /productos/:id → Eliminar producto
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const { vendedorId } = req;

    await productService.deleteProduct(Number(id), vendedorId);
    return res.status(204).send();
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    return res.status(400).json({ error: error.message });
  }
}

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateQuantity,
  deleteProduct,
};
