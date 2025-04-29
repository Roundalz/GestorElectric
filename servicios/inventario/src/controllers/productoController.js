import productService from "../services/productoService.js";

/**
 * Controlador para rutas relacionadas con PRODUCTOS.
 */

/**
 * POST /productos
 * Crea un nuevo producto con sus características e imágenes.
 */
export async function createProduct(req, res) {
  try {
    const data = req.body;
    const newProduct = await productService.createProduct(data);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error en createProduct:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * GET /productos
 * Obtiene todos los productos o filtra por nombre si se pasa query ?name=
 */
export async function getProducts(req, res) {
  try {
    const { name } = req.query;
    let products;
    if (name) {
      products = await productService.getProductsByName(name);
    } else {
      products = await productService.getAllProducts();
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error en getProducts:", error);
    return res.status(500).json({ error: "Error al obtener productos" });
  }
}

/**
 * GET /productos/:id
 * Obtiene un producto por su ID.
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(Number(id));
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error en getProductById:", error);
    return res.status(500).json({ error: "Error al obtener el producto" });
  }
}

/**
 * PUT /productos/:id
 * Actualiza un producto y sus relaciones (características, imágenes).
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await productService.updateProduct(Number(id), data);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error en updateProduct:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * PATCH /productos/:id/cantidad
 * Actualiza sólo la cantidad disponible de un producto.
 */
export async function updateQuantity(req, res) {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    const newQty = await productService.updateQuantity(Number(id), Number(cantidad));
    return res.status(200).json({ cantidad_disponible_producto: newQty });
  } catch (error) {
    console.error("Error en updateQuantity:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * DELETE /productos/:id
 * Elimina un producto y sus datos relacionados.
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await productService.deleteProduct(Number(id));
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
