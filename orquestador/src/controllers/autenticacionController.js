// orquestador/src/controllers/autenticacionController.js
import pool   from '../database.js';
import crypto from 'crypto';
/* ─────────── BLOQUEO POR INTENTOS FALLIDOS (solo BD) ──────────── */
const MAX_FALLOS   = 3;          // 3 intentos
const BLOQUEO_MIN  = 30;         // 30 min

// ① inserta (o actualiza) la tabla LOGIN_ATTEMPT
const insertLoginAttempt = (email, role, ok, ip) =>
  pool.query(
    `INSERT INTO LOGIN_ATTEMPT (email, role, ts, success, ip_origin)
     VALUES ($1,$2, (NOW() AT TIME ZONE 'America/La_Paz'), $3,$4)`,
    [email, role, ok, ip ?? null]
  );
  const recordLoginAttempt = insertLoginAttempt;   // alias legible


// ② cuántos fallos lleva en la última ½ hora
const countRecentFails = async (email, role) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n
       FROM LOGIN_ATTEMPT
      WHERE email=$1 AND role=$2 AND success=false
        AND ts > (NOW() AT TIME ZONE 'America/La_Paz') - INTERVAL '30 minutes'`,
    [email, role]
  );
  return rows[0].n;
};

// ③ registrar bloqueo y devolver fecha de desbloqueo
const lockAccount = async (email, role, ip) => {
  const { rows } = await pool.query(
    `INSERT INTO ACCOUNT_LOCK (email, role, locked_at, unlock_at, ip_origin, motivo)
     VALUES ($1,$2, (NOW() AT TIME ZONE 'America/La_Paz'), (NOW() AT TIME ZONE 'America/La_Paz') + INTERVAL '${BLOQUEO_MIN} minutes',$3,'exceso_fallos')
     RETURNING locked_at`,
    [email, role, ip ?? null]
  );
  return rows[0].unlock_at;
};

// ④ ¿está ya bloqueado?
const accountIsLocked = async (email, role) => {
  const { rows } = await pool.query(
    `SELECT unlock_at
       FROM ACCOUNT_LOCK
      WHERE email=$1 AND role=$2 AND unlock_at > (NOW() AT TIME ZONE 'America/La_Paz')
   ORDER BY unlock_at DESC LIMIT 1`,
    [email, role]
  );
  return rows.length ? rows[0].unlock_at : null;
};

// ⑤ endpoint *SOLAMENTE* para registrar fallos desde el frontend
export const intentoFallido = async (req, res) => {
  const { email, role } = req.body;          // role = 'cliente' | 'vendedor'
  const ip           = remoteIp(req);
  const desbloqueo   = await accountIsLocked(email, role);

  if (desbloqueo) {
    // 🔥 Corregir desfase de 4 horas SOLO aquí
    const unlockDate = new Date(desbloqueo);
    unlockDate.setHours(unlockDate.getHours() + 4);

    return res.status(423).json({
      bloqueado: true,
      unlock_at: unlockDate.toISOString()   // en ISO para el frontend
    });
  }

  await insertLoginAttempt(email, role, false, ip);
  const fallos = await countRecentFails(email, role);

  if (fallos >= MAX_FALLOS) {
    const unlock_at = await lockAccount(email, role, ip);

    const unlockDate = new Date(unlock_at);
    unlockDate.setHours(unlockDate.getHours() + 4);

    return res.status(423).json({
      bloqueado: true,
      unlock_at: unlockDate.toISOString()
    });
  }

  res.json({
    bloqueado: false,
    restantes: MAX_FALLOS - fallos
  });
};


/* ─────────────────────── HELPERS PARA LOGS ──────────────────────── */
const addLogEvento  = async (usuario_id, accion, ip) =>
  pool.query(
    `INSERT INTO LOG_EVENTO (usuario_id, fecha_hora, accion, ip_origen)
     VALUES ($1, (NOW() AT TIME ZONE 'America/La_Paz'), $2, $3)`,
    [usuario_id, accion, ip ?? null]
  );

const addLogUsuario = async (usuario_id, ip) =>
  pool.query(
    `INSERT INTO LOG_USUARIO (usuario_id, fecha_hora, ip_origen)
     VALUES ($1, (NOW() AT TIME ZONE 'America/La_Paz'), $2)`,
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
       VALUES ($1,$2,(NOW() AT TIME ZONE 'America/La_Paz'),$3,$4,$5)
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

    // Insertar VENDEDOR
    const { rows } = await pool.query(
      `INSERT INTO VENDEDOR
       (nombre_vendedor, correo_vendedor, telefono_vendedor, clave_vendedor, estado_vendedor,
        nombre_empresa, tipo_empresa, logo_empresa, correo_empresa, telefono_empresa,
        pais_empresa, ciudad_empresa, direccion_empresa, banner_empresa, PLANES_PAGO_codigo_plan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING codigo_vendedore, nombre_empresa`,
      [
        nombre_vendedor, email, telefono_vendedor, claveFinal, estado_vendedor,
        nombre_empresa, tipo_empresa, logo_empresa, correo_empresa, telefono_empresa,
        pais_empresa, ciudad_empresa, direccion_empresa, banner_empresa,
        PLANES_PAGO_codigo_plan
      ]
    );

    const nuevoVendedorId = rows[0].codigo_vendedore;
    const codigoPortal = nombre_empresa.toLowerCase().replace(/\s+/g, '-'); // nombre_empresa → formato código_portal

    // Insertar PORTAL
    await pool.query(
      `INSERT INTO PORTAL (codigo_portal, publicidad_portal, VENDEDOR_codigo_vendedore, estado_portal)
       VALUES ($1, false, $2, 'Activo')`,
      [codigoPortal, nuevoVendedorId]
    );

    // Insertar PORTAL_CONFIGURACION
    await pool.query(
      `INSERT INTO PORTAL_CONFIGURACION (
        PORTAL_codigo_portal, estilo_titulo, color_principal, color_secundario,
        color_fondo, fuente_principal, disposicion_productos, productos_por_fila,
        mostrar_precios, mostrar_valoraciones, estilo_header, mostrar_busqueda,
        mostrar_categorias, estilos_productos, mostrar_banner, logo_personalizado,
        banner_personalizado, fecha_actualizacion, opciones_avanzadas, scripts_personalizados,
        estilos_botones, efecto_hover_productos, opciones_filtrados, mostrar_ofertas,
        mostrar_boton_whatsapp, whatsapp_numero, mostrar_instragram_feed, instagram_link
      )
      VALUES (
        $1, 'bold 24px Arial', '#e74c3c', '#f39c12',
        '#ffffff', 'Arial', 'grid', 4,
        true, true, 'fixed', true,
        true, 'card', true, 'logos/default_logo.jpg',
        'banners/default_banner.jpg', (NOW() AT TIME ZONE 'America/La_Paz'),
        '{"seo": {"meta_title": "Portal Nuevo", "meta_description": "Tienda online personalizada"}}', '',
        'redondeado', 'sombra', '{"precio": true, "categorias": true}', 
        false, false, 0, false, ''
      )`,
      [codigoPortal]
    );

    /* LOG_EVENTO → registro_vendedor */
    await addLogEvento(nuevoVendedorId, 'registro_vendedor', remoteIp(req));

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
    // 🔴 Primero, revisamos si la cuenta está bloqueada
    const { rows: lock } = await pool.query(
      `SELECT unlock_at
         FROM ACCOUNT_LOCK
        WHERE email=$1 AND role='cliente' AND unlock_at > (NOW() AT TIME ZONE 'America/La_Paz')
     ORDER BY unlock_at DESC LIMIT 1`,
      [email]
    );
    if (lock.length) {
      return res.status(423).json({
        error: `Cuenta bloqueada hasta las ${new Date(lock[0].unlock_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
      });
    }

    const { rows } = await pool.query(
      'SELECT * FROM CLIENTE WHERE correo_cliente = $1',
      [email]
    );
    if (!rows.length)
      return res.status(404).json({ error: 'Cliente no encontrado' });

    const id = rows[0].codigo_cliente;

    await Promise.all([
      addLogUsuario(id, remoteIp(req)),
      addLogEvento(id, 'login_cliente', remoteIp(req)),
      recordLoginAttempt(email, 'cliente', true, remoteIp(req))
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
    // 🔴 Primero, revisamos si la cuenta está bloqueada
    const { rows: lock } = await pool.query(
      `SELECT unlock_at
         FROM ACCOUNT_LOCK
        WHERE email=$1 AND role='vendedor' AND unlock_at > (NOW() AT TIME ZONE 'America/La_Paz')
     ORDER BY unlock_at DESC LIMIT 1`,
      [email]
    );
    if (lock.length) {
      return res.status(423).json({
        error: `Cuenta bloqueada hasta las ${new Date(lock[0].unlock_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
      });
    }

    const { rows } = await pool.query(
      'SELECT * FROM VENDEDOR WHERE correo_vendedor = $1',
      [email]
    );
    if (!rows.length)
      return res.status(404).json({ error: 'Vendedor no encontrado con este correo' });

    if (rows[0].clave_vendedor !== clave_vendedor)
      return res.status(400).json({ error: 'La clave de vendedor no coincide' });

    const id = rows[0].codigo_vendedore;

    await Promise.all([
      addLogUsuario(id, remoteIp(req)),
      addLogEvento(id, 'login_vendedor', remoteIp(req)),
      recordLoginAttempt(email, 'vendedor', true, remoteIp(req))
    ]);

    res.json(rows[0]);
  } catch (e) {
    console.error('loginVendedor →', e);
    res.status(500).json({ error: 'Error en el login de vendedor' });
  }
};



/* ─────────────────────────── LOGOUT USUARIO ───────────────────────── */
export const logoutUsuario = async (req, res) => {
  const { usuario_id } = req.body;          // espera { usuario_id }
  if (!usuario_id)
    return res.status(400).json({ error: 'Falta usuario_id' });

  try {
    await addLogEvento(usuario_id, 'logout', remoteIp(req));
    res.json({ ok: true });
  } catch (err) {
    console.error('logoutUsuario →', err);
    res.status(500).json({ error: 'Error registrando logout' });
  }
};

