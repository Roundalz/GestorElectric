// controllers/accountLockController.js
import pool from "../database.js"; // o como sea tu instancia de DB

// Traer todos los bloqueos
export const getAccountLocks = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id_lock, email, role, unlock_at
      FROM ACCOUNT_LOCK
      ORDER BY unlock_at DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error("Error al obtener bloqueos", e);
    res.status(500).json({ error: "Error al obtener bloqueos" });
  }
};

// Desbloquear manualmente (poner unlock_at = NOW())
export const unlockAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE ACCOUNT_LOCK
       SET unlock_at = (NOW() AT TIME ZONE 'America/La_Paz')
       WHERE id_lock = $1
       RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.json({ message: "Cuenta desbloqueada", updated: result.rows[0] });
  } catch (e) {
    console.error("Error al desbloquear cuenta", e);
    res.status(500).json({ error: "Error al desbloquear cuenta" });
  }
};