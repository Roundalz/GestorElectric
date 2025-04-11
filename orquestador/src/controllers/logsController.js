import db from "../db.js";

// GET
export const obtenerLogs = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM logs ORDER BY fecha DESC");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener logs" });
  }
};
