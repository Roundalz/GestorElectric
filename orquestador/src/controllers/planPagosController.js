import pool from "../database.js";
import { registrarLog } from "./logsController.js"; // Importar función para registrar logs

// Obtener todos los planes
export const obtenerPlanes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM planes_pago");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en obtenerPlanes:", error);
    res.status(500).json({ error: "Error al obtener planes de pago." });
  }
};

// Crear un nuevo plan
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
    const result = await pool.query(
      `INSERT INTO planes_pago 
        (nombre_plan, descripcion, precio_m_s_a, comision_venta, max_productos, fecha_expiracion_plan)
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        nombre_plan,
        descripcion,
        precio_m_s_a,
        comision_venta,
        max_productos,
        fecha_expiracion_plan,
      ]
    );

    // Registrar log después de crear el plan
    await registrarLog({
      usuario_id: 1, // Luego puedes sacar del token
      accion: `Creó un nuevo plan: ${nombre_plan}`,
      ip_origen: req.ip,
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear plan:", error);
    res.status(500).json({ error: "Error al crear plan." });
  }
};

// Actualizar un plan existente
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
    const result = await pool.query(
      `UPDATE planes_pago 
       SET nombre_plan = $1, descripcion = $2, precio_m_s_a = $3, comision_venta = $4, 
           max_productos = $5, fecha_expiracion_plan = $6
       WHERE codigo_plan = $7
       RETURNING *`,
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

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Plan no encontrado." });
    }

    // Registrar log después de actualizar el plan
    await registrarLog({
      usuario_id: 1,
      accion: `Actualizó el plan con ID ${id}`,
      ip_origen: req.ip,
    });

    res.status(200).json({ mensaje: "Plan actualizado correctamente." });
  } catch (error) {
    console.error("Error en actualizarPlan:", error);
    res.status(500).json({ error: "Error al actualizar el plan de pago." });
  }
};

// Eliminar un plan
export const eliminarPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM planes_pago WHERE codigo_plan = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Plan no encontrado." });
    }

    // Registrar log después de eliminar el plan
    await registrarLog({
      usuario_id: 1,
      accion: `Eliminó el plan con ID ${id}`,
      ip_origen: req.ip,
    });

    res.status(200).json({ mensaje: "Plan eliminado correctamente." });
  } catch (error) {
    console.error("Error en eliminarPlan:", error);
    res.status(500).json({ error: "Error al eliminar el plan de pago." });
  }
};
