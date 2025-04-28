// controllers/PlanController.js (versión pg)
import db from "../database.js";

export const obtenerPlanesPago = async (_, res) => {
  try {
    const result = await db.query("SELECT * FROM PLANES_PAGO"); // pg devuelve objeto
    res.json(result.rows);                                      // enviamos el array
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener planes de pago" });
  }
};

export const cambiarPlanVendedor = async (req, res) => {
  const { codigo_vendedore } = req.params;
  const { nuevo_plan_id } = req.body;

  try {
    // Actualizar el plan
    const update = await db.query(
      `UPDATE VENDEDOR 
       SET PLANES_PAGO_codigo_plan = $1 
       WHERE codigo_vendedore = $2 
       RETURNING codigo_vendedore, PLANES_PAGO_codigo_plan`,
      [nuevo_plan_id, codigo_vendedore]
    );

    // Traer el nombre del plan
    const plan = await db.query(
      `SELECT nombre_plan FROM PLANES_PAGO WHERE codigo_plan = $1`,
      [nuevo_plan_id]
    );

    // Combinar vendedor actualizado + nombre_plan
    const vendedorActualizado = {
      ...update.rows[0],
      nombre_plan: plan.rows[0]?.nombre_plan || null
    };

    res.json(vendedorActualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al cambiar de plan" });
  }
};
