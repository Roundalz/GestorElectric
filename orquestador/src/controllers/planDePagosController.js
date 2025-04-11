import db from "../db.js";

// GET
export const obtenerPlanes = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM planes_pago");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener planes" });
  }
};

// POST
export const crearPlan = async (req, res) => {
  const { nombre, descripcion, monto } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO planes_pago (nombre, descripcion, monto) VALUES (?, ?, ?)",
      [nombre, descripcion, monto]
    );
    res.json({ id: result.insertId, nombre, descripcion, monto });
  } catch (error) {
    res.status(500).json({ error: "Error al crear plan" });
  }
};

// PUT
export const actualizarPlan = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, monto } = req.body;
  try {
    await db.query(
      "UPDATE planes_pago SET nombre = ?, descripcion = ?, monto = ? WHERE id = ?",
      [nombre, descripcion, monto, id]
    );
    res.json({ id, nombre, descripcion, monto });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar plan" });
  }
};

// DELETE
export const eliminarPlan = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM planes_pago WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar plan" });
  }
};
