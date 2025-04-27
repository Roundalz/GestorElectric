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
