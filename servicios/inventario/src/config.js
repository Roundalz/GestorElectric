import pool from './database.js';
/**
 * Recupera el PORTAL.codigo_portal asociado al vendedor dado.
 * @param {number} vendedorId 
 * @returns {Promise<string>} portalCode
 */
export async function getPortalCodeByVendedor(vendedorId) {
    const { rows } = await pool.query(
      `SELECT codigo_portal FROM PORTAL WHERE VENDEDOR_codigo_vendedore = $1`,
      [vendedorId]
    );
    if (rows.length === 0) {
      throw new Error("Portal no encontrado para el vendedor");
    }
    return rows[0].codigo_portal;
  }
  
export default {
  getPortalCodeByVendedor,
};
