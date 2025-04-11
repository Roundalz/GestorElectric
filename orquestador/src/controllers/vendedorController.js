import db from "../db.js";

// GET
export const obtenerVendedores = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM vendedores");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener vendedores" });
  }
};

// POST
export const crearVendedor = async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO vendedores (nombre, correo, telefono) VALUES (?, ?, ?)",
      [nombre, correo, telefono]
    );
    res.json({ id: result.insertId, nombre, correo, telefono });
  } catch (error) {
    res.status(500).json({ error: "Error al crear vendedor" });
  }
};

// PUT
export const actualizarVendedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono } = req.body;
  try {
    await db.query(
      "UPDATE vendedores SET nombre = ?, correo = ?, telefono = ? WHERE id = ?",
      [nombre, correo, telefono, id]
    );
    res.json({ id, nombre, correo, telefono });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar vendedor" });
  }
};

// DELETE
export const eliminarVendedor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM vendedores WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar vendedor" });
  }
};
