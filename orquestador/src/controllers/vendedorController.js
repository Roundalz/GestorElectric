import db from "../db.js";

// GET
export const obtenerVendedores = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM VENDEDOR");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener vendedores" });
  }
};

// POST
export const crearVendedor = async (req, res) => {
  const {
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
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO VENDEDOR (
        nombre_vendedor, correo_vendedor, telefono_vendedor, clave_vendedor, estado_vendedor,
        nombre_empresa, tipo_empresa, logo_empresa, correo_empresa, telefono_empresa,
        pais_empresa, ciudad_empresa, direccion_empresa, banner_empresa, PLANES_PAGO_codigo_plan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Error al crear vendedor" });
  }
};

// PUT
export const actualizarVendedor = async (req, res) => {
  const { id } = req.params;
  const {
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
  } = req.body;

  try {
    await db.query(
      `UPDATE VENDEDOR SET
        nombre_vendedor = ?, correo_vendedor = ?, telefono_vendedor = ?, clave_vendedor = ?, estado_vendedor = ?,
        nombre_empresa = ?, tipo_empresa = ?, logo_empresa = ?, correo_empresa = ?, telefono_empresa = ?,
        pais_empresa = ?, ciudad_empresa = ?, direccion_empresa = ?, banner_empresa = ?, PLANES_PAGO_codigo_plan = ?
      WHERE codigo_vendedore = ?`,
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
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar vendedor" });
  }
};

// DELETE
export const eliminarVendedor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM VENDEDOR WHERE codigo_vendedore = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar vendedor" });
  }
};
