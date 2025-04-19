const pool = require("../config/db");

exports.obtenerVendedores = async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM VENDEDOR");
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearVendedor = async (req, res) => {
  try {
    const {
      nombre_vendedor,
      correo_vendedor,
      telefono_vendedor,
      clave_vendedor,
      estado_vendedor = "activo",
      nombre_empresa,
      tipo_empresa,
      logo_empresa = "default_logo.png",
      correo_empresa,
      telefono_empresa,
      pais_empresa = "Colombia",
      ciudad_empresa,
      direccion_empresa,
      banner_empresa = "default_banner.png",
      PLANES_PAGO_codigo_plan = 1,
    } = req.body;

    // Validar campos requeridos
    if (
      !nombre_vendedor ||
      !correo_vendedor ||
      !telefono_vendedor ||
      !clave_vendedor ||
      !nombre_empresa ||
      !tipo_empresa ||
      !correo_empresa ||
      !telefono_empresa ||
      !ciudad_empresa ||
      !direccion_empresa
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Verificar si el plan existe
    const planExistente = await pool.query(
      "SELECT 1 FROM PLANES_PAGO WHERE codigo_plan = $1",
      [PLANES_PAGO_codigo_plan]
    );

    if (planExistente.rowCount === 0) {
      return res.status(400).json({ error: "El plan especificado no existe" });
    }

    // Insertar vendedor
    const result = await pool.query(
      `INSERT INTO VENDEDOR (
        nombre_vendedor, correo_vendedor, telefono_vendedor, clave_vendedor,
        estado_vendedor, nombre_empresa, tipo_empresa, logo_empresa, correo_empresa,
        telefono_empresa, pais_empresa, ciudad_empresa, direccion_empresa,
        banner_empresa, PLANES_PAGO_codigo_plan
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15
      ) RETURNING *`,
      [
        nombre_vendedor,
        correo_vendedor,
        telefono_vendedor,
        clave_vendedor,
        estado_vendedor,
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
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear vendedor:", error);
    res.status(500).json({
      error: "Error al crear vendedor",
      detalle: error.message,
    });
  }
};

exports.actualizarVendedor = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_vendedor,
    correo_vendedor,
    telefono_vendedor,
    clave_vendedor,
    estado_vendedor = "activo",
    nombre_empresa,
    tipo_empresa,
    logo_empresa = "default_logo.png",
    correo_empresa,
    telefono_empresa,
    pais_empresa = "Colombia",
    ciudad_empresa,
    direccion_empresa,
    banner_empresa = "default_banner.png",
    PLANES_PAGO_codigo_plan = 1,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE VENDEDOR SET 
        nombre_vendedor=$1, correo_vendedor=$2, telefono_vendedor=$3, clave_vendedor=$4,
        estado_vendedor=$5, nombre_empresa=$6, tipo_empresa=$7, logo_empresa=$8, correo_empresa=$9,
        telefono_empresa=$10, pais_empresa=$11, ciudad_empresa=$12, direccion_empresa=$13,
        banner_empresa=$14, PLANES_PAGO_codigo_plan=$15
      WHERE codigo_vendedore=$16
      RETURNING *`,
      [
        nombre_vendedor,
        correo_vendedor,
        telefono_vendedor,
        clave_vendedor,
        estado_vendedor,
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
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Vendedor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar vendedor:", error);
    res.status(500).json({
      error: "Error al actualizar vendedor",
      detalle: error.message,
    });
  }
};

exports.eliminarVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM VENDEDOR WHERE codigo_vendedore = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Vendedor no encontrado" });
    }

    res.json({
      mensaje: "Vendedor eliminado correctamente",
      vendedor: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar vendedor:", error);
    res.status(500).json({
      error: "Error al eliminar vendedor",
      detalle: error.message,
    });
  }
};
