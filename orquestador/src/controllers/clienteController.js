import pool from "../database.js";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cliente");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear cliente
export const createCliente = async (req, res) => {
  const {
    nombre_cliente,
    correo_cliente,
    telefono_cliente,
    cumpleanos_cliente,
    foto_perfil_cliente,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cliente (nombre_cliente, correo_cliente, fecha_registro_cliente, telefono_cliente, cumpleanos_cliente, foto_perfil_cliente) 
       VALUES ($1, $2, CURRENT_DATE, $3, $4, $5) RETURNING *`,
      [
        nombre_cliente,
        correo_cliente,
        telefono_cliente,
        cumpleanos_cliente,
        foto_perfil_cliente,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_cliente,
    correo_cliente,
    telefono_cliente,
    cumpleanos_cliente,
    foto_perfil_cliente,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cliente 
       SET nombre_cliente = $1, correo_cliente = $2, telefono_cliente = $3, cumpleanos_cliente = $4, foto_perfil_cliente = $5 
       WHERE codigo_cliente = $6 RETURNING *`,
      [
        nombre_cliente,
        correo_cliente,
        telefono_cliente,
        cumpleanos_cliente,
        foto_perfil_cliente,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM cliente WHERE codigo_cliente = $1", [id]);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
