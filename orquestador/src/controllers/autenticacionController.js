// orquestador/src/controllers/autenticacionController.js
import pool from '../database.js';

// Función para el registro de un cliente
export const registerCliente = async (req, res) => {
  const { email, nombre_cliente, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente } = req.body;
  try {
    // Verificar que el correo no exista ya
    const existing = await pool.query('SELECT * FROM CLIENTE WHERE correo_cliente = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    // Insertar el nuevo cliente; se utiliza la fecha actual para fecha_registro_cliente
    const today = new Date();
    const result = await pool.query(
      `INSERT INTO CLIENTE (nombre_cliente, correo_cliente, fecha_registro_cliente, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre_cliente, email, today, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente]
    );
    console.log(result);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error en el registro" });
  }
};

// Función para el login de un cliente
export const loginCliente = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM CLIENTE WHERE correo_cliente = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en el login" });
  }
};
