// orquestador/src/controllers/autenticacionController.js
import pool from '../database.js';
import crypto from 'crypto'; // Para generar la clave de vendedor

// =======================
// REGISTRO DE CLIENTE
// =======================
export const registerCliente = async (req, res) => {
  const {
    email,
    nombre_cliente,
    telefono_cliente,
    cumpleanos_cliente,
    foto_perfil_cliente
  } = req.body;

  try {
    // Verificar que no exista un cliente con ese correo
    const existing = await pool.query(
      'SELECT * FROM CLIENTE WHERE correo_cliente = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado como cliente" });
    }

    // Insertar el nuevo cliente
    const fechaRegistro = new Date();
    const result = await pool.query(
      `INSERT INTO CLIENTE
       (nombre_cliente, correo_cliente, fecha_registro_cliente, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        nombre_cliente,
        email,
        fechaRegistro,
        telefono_cliente,
        cumpleanos_cliente,
        foto_perfil_cliente
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en registerCliente:", error);
    res.status(500).json({ error: "Error en registro de cliente" });
  }
};

// =======================
// REGISTRO DE VENDEDOR
// =======================
export const registerVendedor = async (req, res) => {
  const {
    email,
    nombre_vendedor,
    telefono_vendedor,
    nombre_empresa,
    tipo_empresa,
    logo_empresa,
    correo_empresa,
    telefono_empresa,
    pais_empresa,
    ciudad_empresa,
    direccion_empresa,
    banner_empresa
  } = req.body;

  try {
    // Verificar que no exista un vendedor con ese correo
    const existing = await pool.query(
      'SELECT * FROM VENDEDOR WHERE correo_vendedor = $1',
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado como vendedor" });
    }

    // Generar clave_vendedor aleatoria usando crypto (8 caracteres hexadecimales)
    const claveVendedor = crypto.randomBytes(4).toString('hex');
    const estadoVendedor = "ACTIVO";

    const result = await pool.query(
      `INSERT INTO VENDEDOR
       (nombre_vendedor, correo_vendedor, telefono_vendedor, clave_vendedor, estado_vendedor,
        nombre_empresa, tipo_empresa, logo_empresa, correo_empresa, telefono_empresa,
        pais_empresa, ciudad_empresa, direccion_empresa, banner_empresa, PLANES_PAGO_codigo_plan)
       VALUES ($1, $2, $3, $4, $5,
               $6, $7, $8, $9, $10,
               $11, $12, $13, $14, 1)
       RETURNING *`,
      [
        nombre_vendedor,
        email,
        telefono_vendedor,
        claveVendedor,
        estadoVendedor,
        nombre_empresa,
        tipo_empresa,
        logo_empresa,
        correo_empresa,
        telefono_empresa,
        pais_empresa,
        ciudad_empresa,
        direccion_empresa,
        banner_empresa
      ]
    );

    // Retorna también la clave generada para que el vendedor la conozca
    res.status(201).json({ vendedor: result.rows[0], clave_vendedor: claveVendedor });
  } catch (error) {
    console.error("Error en registerVendedor:", error);
    res.status(500).json({ error: "Error en registro de vendedor" });
  }
};

// =======================
// LOGIN DE CLIENTE
// =======================
export const loginCliente = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM CLIENTE WHERE correo_cliente = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en loginCliente:", error);
    res.status(500).json({ error: "Error en el login de cliente" });
  }
};

// =======================
// LOGIN DE VENDEDOR
// =======================
export const loginVendedor = async (req, res) => {
  const { email, clave_vendedor } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM VENDEDOR WHERE correo_vendedor = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vendedor no encontrado con este correo" });
    }

    // Validar la clave de vendedor
    if (result.rows[0].clave_vendedor !== clave_vendedor) {
      return res.status(400).json({ error: "La clave de vendedor no coincide" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en loginVendedor:", error);
    res.status(500).json({ error: "Error en el login de vendedor" });
  }
};
