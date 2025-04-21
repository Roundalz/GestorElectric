// orquestador/src/controllers/PagoController.js
import pool from '../database.js';

// ===============
//  CREAR PAGO
// ===============
export const crearPago = async (req, res) => {
  // 1) Traza de lo que viene del front‑end
  console.log('▶️  [crearPago] body recibido =>', req.body);

  const {
    fecha_pago,
    monto_pago,
    estado_pago,
    VENDEDOR_codigo_vendedore
  } = req.body;

  // 2) Validación de campos requeridos
  if (
    !fechaPagoValido(fecha_pago) ||
    typeof monto_pago !== 'number' ||
    !estado_pago ||
    !VENDEDOR_codigo_vendedore
  ) {
    console.warn('⚠️  [crearPago] Datos incompletos o en formato incorrecto');
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    // 3) Inserción
    const query = `
      INSERT INTO PAGO
        (fecha_pago, monto_pago, estado_pago, VENDEDOR_codigo_vendedore)
      VALUES ($1, $2, $3, $4)
      RETURNING codigo_pago
    `;
    console.log('📝  Ejecutando query PAGO =>', query);

    const result = await pool.query(query, [
      fecha_pago,
      monto_pago,
      estado_pago,
      VENDEDOR_codigo_vendedore
    ]);

    console.log('✅  [crearPago] Pago creado con ID:', result.rows[0].codigo_pago);
    res.status(201).json({ codigo_pago: result.rows[0].codigo_pago });
  } catch (err) {
    console.error('❌  [crearPago] Error al crear pago:', err);
    res.status(500).json({ error: 'Error al crear pago' });
  }
};

// ------ helpers ------
function fechaPagoValido(fecha) {
  // YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}