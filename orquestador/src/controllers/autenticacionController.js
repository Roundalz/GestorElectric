// orquestador/src/controllers/autenticacionController.js
import pool   from '../database.js';
import crypto from 'crypto';

/* ─────────────────────── HELPERS PARA LOGS ──────────────────────── */
const addLogEvento  = async (usuario_id, accion, ip) =>
  pool.query(
    `INSERT INTO LOG_EVENTO (usuario_id, fecha_hora, accion, ip_origen)
     VALUES ($1, NOW(), $2, $3)`,
    [usuario_id, accion, ip ?? null]
  );

const addLogUsuario = async (usuario_id, ip) =>
  pool.query(
    `INSERT INTO LOG_USUARIO (usuario_id, fecha_hora, ip_origen)
     VALUES ($1, NOW(), $2)`,
    [usuario_id, ip ?? null]
  );

/* Utilidad para IP remota (toma X‑Forwarded‑For si existe) */
const remoteIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

/* ─────────────────────────  REGISTRO CLIENTE  ───────────────────── */
export const registerCliente = async (req, res) => {
  const {
    email,
    nombre_cliente,
    telefono_cliente,
    cumpleanos_cliente,
    foto_perfil_cliente
  } = req.body;

  try {
    /* A. evitar duplicados */
    const { rows: dup } = await pool.query(
      'SELECT 1 FROM CLIENTE WHERE correo_cliente = $1',
      [email]
    );
    if (dup.length) {
      return res.status(400).json({ error: 'El correo ya está registrado como cliente' });
    }

    /* B. insertar cliente */
    const { rows } = await pool.query(
      `INSERT INTO CLIENTE
       (nombre_cliente, correo_cliente, fecha_registro_cliente,
        telefono_cliente, cumpleanos_cliente, foto_perfil_cliente)
       VALUES ($1,$2,NOW(),$3,$4,$5)
       RETURNING codigo_cliente`,
      [nombre_cliente, email, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente]
    );

    /* C. LOG_EVENTO → registro_cliente */
    await addLogEvento(rows[0].codigo_cliente, 'registro_cliente', remoteIp(req));

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('registerCliente →', e);
    res.status(500).json({ error: 'Error en registro de cliente' });
  }
};

/* ─────────────────────────  REGISTRO VENDEDOR  ───────────────────── */
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
    banner_empresa,
    PLANES_PAGO_codigo_plan,
    clave_vendedor,               // puede venir ya generado
    estado_vendedor = 'activo'
  } = req.body;

  const claveFinal =
    clave_vendedor ||
    crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();

  try {
    const { rows: dup } = await pool.query(
      'SELECT 1 FROM VENDEDOR WHERE correo_vendedor = $1',
      [email]
    );
    if (dup.length) {
      return res.status(400).json({ error: 'El correo ya está registrado como vendedor' });
    }

    const { rows } = await pool.query(
      `INSERT INTO VENDEDOR
       (nombre_vendedor, correo_vendedor, telefono_vendedor, clave_vendedor, estado_vendedor,
        nombre_empresa, tipo_empresa, logo_empresa, correo_empresa, telefono_empresa,
        pais_empresa, ciudad_empresa, direccion_empresa, banner_empresa, PLANES_PAGO_codigo_plan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING codigo_vendedore, clave_vendedor`,
      [
        nombre_vendedor, email, telefono_vendedor, claveFinal, estado_vendedor,
        nombre_empresa, tipo_empresa, logo_empresa, correo_empresa, telefono_empresa,
        pais_empresa, ciudad_empresa, direccion_empresa, banner_empresa,
        PLANES_PAGO_codigo_plan
      ]
    );

    /* LOG_EVENTO → registro_vendedor */
    await addLogEvento(rows[0].codigo_vendedore, 'registro_vendedor', remoteIp(req));

    res.status(201).json(rows[0]);   // { codigo_vendedore, clave_vendedor }
  } catch (e) {
    console.error('registerVendedor →', e);
    res.status(500).json({ error: 'Error en registro de vendedor' });
  }
};

/* ───────────────────────────  LOGIN CLIENTE  ─────────────────────── */
export const loginCliente = async (req, res) => {
  const { email } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM CLIENTE WHERE correo_cliente = $1',
      [email]
    );
    if (!rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });

    const id = rows[0].codigo_cliente;

    /* LOG_USUARIO + LOG_EVENTO → login_cliente */
    await Promise.all([
      addLogUsuario(id, remoteIp(req)),
      addLogEvento(id, 'login_cliente', remoteIp(req))
    ]);

    res.json(rows[0]);
  } catch (e) {
    console.error('loginCliente →', e);
    res.status(500).json({ error: 'Error en el login de cliente' });
  }
};

/* ───────────────────────────  LOGIN VENDEDOR  ────────────────────── */
export const loginVendedor = async (req, res) => {
  const { email, clave_vendedor } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM VENDEDOR WHERE correo_vendedor = $1',
      [email]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Vendedor no encontrado con este correo' });
    }
    if (rows[0].clave_vendedor !== clave_vendedor) {
      return res.status(400).json({ error: 'La clave de vendedor no coincide' });
    }

    const id = rows[0].codigo_vendedore;

    /* LOG_USUARIO + LOG_EVENTO → login_vendedor */
    await Promise.all([
      addLogUsuario(id, remoteIp(req)),
      addLogEvento(id, 'login_vendedor', remoteIp(req))
    ]);

    res.json(rows[0]);
  } catch (e) {
    console.error('loginVendedor →', e);
    res.status(500).json({ error: 'Error en el login de vendedor' });
  }
};