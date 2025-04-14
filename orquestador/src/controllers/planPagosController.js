import db from "../db.js";

// GET
export const obtenerPlanes = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM planes_pago");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener planes de pago" });
  }
};

// POST
export const crearPlan = async (req, res) => {
  const {
    nombre_plan,
    descripcion,
    precio_m_s_a,
    comision_venta,
    max_productos,
    fecha_expiracion_plan,
  } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO planes_pago (nombre_plan, descripcion, precio_m_s_a, comision_venta, max_productos, fecha_expiracion_plan) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre_plan,
        descripcion,
        precio_m_s_a,
        comision_venta,
        max_productos,
        fecha_expiracion_plan,
      ]
    );

    res.json({
      codigo_plan: result.insertId,
      nombre_plan,
      descripcion,
      precio_m_s_a,
      comision_venta,
      max_productos,
      fecha_expiracion_plan,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear plan de pago" });
  }
};

// PUT
export const actualizarPlan = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_plan,
    descripcion,
    precio_m_s_a,
    comision_venta,
    max_productos,
    fecha_expiracion_plan,
  } = req.body;
  try {
    await db.query(
      `UPDATE planes_pago SET nombre_plan = ?, descripcion = ?, precio_m_s_a = ?, comision_venta = ?, max_productos = ?, fecha_expiracion_plan = ? WHERE codigo_plan = ?`,
      [
        nombre_plan,
        descripcion,
        precio_m_s_a,
        comision_venta,
        max_productos,
        fecha_expiracion_plan,
        id,
      ]
    );
    res.json({
      codigo_plan: id,
      nombre_plan,
      descripcion,
      precio_m_s_a,
      comision_venta,
      max_productos,
      fecha_expiracion_plan,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar plan de pago" });
  }
};

// DELETE
export const eliminarPlan = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM planes_pago WHERE codigo_plan = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar plan de pago" });
  }
};
